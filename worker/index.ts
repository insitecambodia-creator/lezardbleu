/**
 * Cloudflare Worker. Static pages are served from ./dist by the assets binding; only /api/*
 * reaches this code (see wrangler.jsonc).
 *
 * POST /api/contact  ->  validate, verify Turnstile, forward to the n8n webhook.
 */

import { parseQuote, quoteSummary } from '../src/quote-schema';

interface Env {
  ASSETS: Fetcher;
  N8N_WEBHOOK_URL: string;
  N8N_WEBHOOK_TOKEN?: string;
  TURNSTILE_SECRET?: string;
}

interface Enquiry {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  interests?: unknown;
  message?: unknown;
  website?: unknown;
  locale?: unknown;
  pageUrl?: unknown;
  turnstileToken?: unknown;
  /** 'framing-quote' for the multi-step quote form; absent for the contact form */
  formType?: unknown;
  quote?: unknown;
}

const INTERESTS = ['framing', 'printing', 'restoration', 'antiques'];
const LOCALES = ['en', 'fr', 'km'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const text = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  // Same-origin only (the site's own form), plus localhost for `wrangler dev`.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'origin' }, 403);
  }

  let data: Enquiry;
  try {
    data = (await request.json()) as Enquiry;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Honeypot: pretend success so bots learn nothing.
  if (text(data.website, 200)) return json({ ok: true });

  const firstName = text(data.firstName, 80);
  const lastName = text(data.lastName, 80);
  const email = text(data.email, 160);
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const token = text(data.turnstileToken, 2048);
    if (!token) return json({ ok: false, error: 'captcha' }, 400);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    });
    const result = (await verify.json()) as { success?: boolean };
    if (!result.success) return json({ ok: false, error: 'captcha' }, 400);
  }

  let interests = Array.isArray(data.interests)
    ? data.interests.filter((i): i is string => typeof i === 'string' && INTERESTS.includes(i))
    : [];
  const locale = LOCALES.includes(data.locale as string) ? (data.locale as string) : 'en';
  let message = text(data.message, 3000);

  // Framing-quote form: every answer must be one of the known options. The answers are also written, in English,
  // at the top of `message`, so an n8n flow built for the contact form (name, email, phone, topics, message)
  // keeps working and the shop sees the whole request in one cell.
  const isQuote = data.formType === 'framing-quote';
  const quote = isQuote ? parseQuote(data.quote) : null;
  if (isQuote) {
    if (!quote) return json({ ok: false, error: 'invalid' }, 400);
    interests = quote.have === 'digital' ? ['framing', 'printing'] : ['framing'];
    const notes = message;
    message = (quoteSummary(quote) + (notes ? `\n\nNotes: ${notes}` : '')).slice(0, 3000);
  }

  const payload = {
    firstName,
    lastName,
    email,
    phone: text(data.phone, 40),
    interests,
    message,
    ...(quote ? { formType: 'framing-quote', quote } : {}),
    locale,
    pageUrl: text(data.pageUrl, 300),
    submittedAt: new Date().toISOString(),
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.N8N_WEBHOOK_TOKEN) headers['X-Webhook-Token'] = env.N8N_WEBHOOK_TOKEN;

  try {
    const res = await fetch(env.N8N_WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`n8n responded ${res.status}`);
  } catch (err) {
    console.error('Forwarding to n8n failed', err);
    return json({ ok: false, error: 'upstream' }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
