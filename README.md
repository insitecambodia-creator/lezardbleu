# Le Lezard Bleu

One-page website for Le Lezard Bleu (Phnom Penh), built with [Astro](https://astro.build) and
deployed to **Cloudflare Workers** (static assets + a small Worker for the contact form).

Languages: English (`/`), French (`/fr/`), Khmer (`/km/`, built but hidden until translated).

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on http://localhost:4321 (no form backend) |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Build, then run site + Worker locally with `wrangler dev` (form works) |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run check` | Type-check Astro and TypeScript |

Preview the Khmer layout before it is translated: `PUBLIC_PREVIEW_KM=1 npm run dev`.

## Where things live

```
src/config.ts            phone, Telegram, address, GTM id: facts shared by all languages
src/i18n/en|fr|km.ts     ALL page text, one file per language
src/data/clients.ts      client logos list (files in src/assets/clients/)
src/data/gallery.ts      gallery photos and their descriptions (files in src/assets/gallery/)
src/components/          one component per page section
src/styles/global.css    design tokens (colours, type) and all styles
src/assets/              images (optimised at build time)
worker/index.ts          POST /api/contact -> Turnstile check -> n8n webhook
wrangler.jsonc           Cloudflare config
docs/                    company & website brief
reference/               snapshot of the old WordPress page and unused originals
```

### Adding things

- **Logo**: drop the file in `src/assets/brand/` and ask Claude Code to wire it into
  `src/components/Header.astro` (the header currently uses a text wordmark).
- **Client logos**: each entry in `src/data/clients.ts` shows the image with the same name in
  `src/assets/clients/` (e.g. `gallerist.png`). Entries without a file are skipped.
- **Gallery photos**: put the image in `src/assets/gallery/` and add a line to `src/data/gallery.ts`
  (file name without extension, plus a short factual description in English and French). The list order is
  the display order. A photo that is in the folder but not listed still appears, at the end, without a
  description (the build prints a warning). Pages: `/gallery/` and `/fr/gallery/`.
- **Antiques section photo**: it is `src/assets/gallery/le-lezard-bleu3.webp`; change the import in
  `src/components/Antiques.astro` to use another.
- **Khmer**: fill in `src/i18n/km.ts` (copy the shape of `en.ts`; missing keys fall back to English),
  have it reviewed by a native speaker, then set `published: true`.

## Contact form -> n8n

The browser posts to `/api/contact` on the same domain. The Worker validates the fields,
checks the honeypot and Cloudflare Turnstile, then forwards JSON to your n8n **Webhook** node
(method POST). Set these once:

```bash
npx wrangler secret put N8N_WEBHOOK_URL      # the n8n production webhook URL
npx wrangler secret put N8N_WEBHOOK_TOKEN    # optional: any random string
npx wrangler secret put TURNSTILE_SECRET     # from the Cloudflare Turnstile dashboard
```

Add them in the dashboard (Workers & Pages → `lezardbleu` → Settings → Variables and Secrets) with
**Type: Secret**. `wrangler.jsonc` sets `keep_vars: true` so a deployment never wipes dashboard variables, but a
Secret is the safe choice for a webhook URL anyway. If the form suddenly says "something went wrong" after a
deploy, check that `N8N_WEBHOOK_URL` still exists there and that the n8n workflow is **Active**; the Worker
logs (Logs tab) show "n8n responded NNN" or "Forwarding to n8n failed".

Also set the public Turnstile **site key** as the build variable `PUBLIC_TURNSTILE_SITE_KEY`
(Workers Builds → Settings → Variables, or a local `.env`). Without a site key the widget is
hidden; without `TURNSTILE_SECRET` the Worker skips verification. Set both before launch.

If you set `N8N_WEBHOOK_TOKEN`, have the n8n workflow check that the `X-Webhook-Token` header
matches. The payload n8n receives:

```json
{
  "firstName": "Sophie", "lastName": "Martin", "email": "sophie@example.com",
  "phone": "", "interests": ["framing", "antiques"],
  "message": "…", "locale": "fr",
  "pageUrl": "https://www.lezard-bleu.com/fr/", "submittedAt": "2026-10-28T02:13:01.591Z"
}
```

`interests` values are always the English keys `framing`, `printing`, `restoration`, `antiques`;
`locale` tells you which language the visitor used.

**Ready-made n8n workflow**: `docs/n8n-contact-workflow.json` (Webhook → format fields → append a row to the
"SiteForm" Google Sheet → reply OK to the website → Telegram notification). Import it in n8n (Workflows →
Import from file), pick your Google Sheets, Telegram and Header Auth credentials on the nodes, add `Message`
and `Language` columns to the sheet, then activate it and use its **Production** webhook URL.

Local test: copy `.dev.vars.example` to `.dev.vars`, point it at an n8n test webhook, run `npm run preview`.

## Deploying on Cloudflare

1. Cloudflare dashboard → Workers & Pages → Create → connect this GitHub repo (Workers Builds).
2. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. Set the secrets and build variable above. Set `PUBLIC_GTM_ID` only if it differs from the default.
4. Add the custom domain `www.lezard-bleu.com` to the Worker. **Keep the old WordPress site live
   until the checks in `CONTENT-TODO.md` pass**, and keep a backup for rollback (re-point DNS).
   Preserve existing email DNS records (MX, SPF, DKIM).

## Thank-you page

After a successful send the form redirects to `/thank-you/` (`/fr/thank-you/`), a full-screen page over
`src/assets/images/storefront-2026-2.jpg`. The visitor's first name is shown ("Thank you Franck") but is passed
through `sessionStorage`, never the URL, so it does not end up in analytics. The page is `noindex` and left
out of the sitemap. The form also pushes a `contact_form_submit` event to the GTM data layer: use that (or the
`/thank-you/` page view) as the conversion in Google Analytics, not both. Text lives under `thanks` in
`src/i18n/`.

## Design notes

- Colours and type follow `docs/company-and-website-brief.md`. Body text uses `#6E6E6E`, not the
  brief's `#7A7A7A`: the latter fails WCAG AA contrast (4.3:1). Buttons are orange with white text
  (the owner's preference), which is only 2.8:1 contrast, below WCAG AA. If accessibility matters
  more later, darken the button orange or switch the text back to `var(--blue)` (5.5:1) in `.btn`.
- Motion is subtle and one-off: sections fade and rise as they scroll into view (add `data-reveal`
  to an element, and `style="--i: N"` to stagger siblings), and the hero photo settles in on load.
  It switches off for visitors who prefer reduced motion and for anyone without JavaScript.
- No client-side framework. JavaScript is only the form handler and Google Tag Manager, which
  loads after the page has finished loading.
