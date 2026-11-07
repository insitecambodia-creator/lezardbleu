import type { InterestKey } from '../config';
import type { QUOTE_FORMS, QuoteKind } from '../quote-schema';

type OptionsOf<K extends QuoteKind> = (typeof QUOTE_FORMS)[K]['options'];
type AnswerKeys<K extends QuoteKind, Q extends keyof OptionsOf<K>> = Extract<OptionsOf<K>[Q], readonly string[]>[number];

/** The questions and answers of a quote form, typed from its list in quote-schema.ts (a missing translation fails the build) */
export type QuoteSteps<K extends QuoteKind> = {
  [Q in keyof OptionsOf<K>]: { legend: string; hint?: string; options: Record<AnswerKeys<K, Q>, string> };
};

export interface Service {
  title: string;
  text: string;
}

export interface Content {
  /** Km is built but hidden until a native-speaker translation is in place. */
  published: boolean;
  langName: string;
  meta: { title: string; /** social-sharing title; defaults to `title` */ ogTitle?: string; description: string; ogAlt: string };
  ui: {
    skip: string;
    language: string;
    call: string;
    telegram: string;
    opensNewTab: string;
    gallery: string;
    home: string;
    quote: string;
    printing: string;
  };
  /** Hero H1, one entry per line */
  hero: { eyebrow: string; title: string[]; cta: string; imageAlt: string };
  atelier: { title: string; paragraphs: string[]; cta: string };
  services: { title: string; items: Service[]; cta: string };
  printing: { title: string; paragraphs: string[]; imageAlt: string; cta: string; learnMore: string };
  antiques: { title: string; paragraphs: string[]; galleryCta: string; imageAlt: string };
  gallery: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    enquire: string;
    openPhoto: string;
    close: string;
    previous: string;
    next: string;
    /** {n} and {total} are replaced */
    counter: string;
  };
  /** Petit Futé "Recommandé 2026" review. The quote is theirs, word for word (French original). */
  press: { eyebrow: string; quote: string; source: string; note: string; cta: string; quoteLang?: string };
  thanks: {
    metaTitle: string;
    title: string;
    /** {name} is replaced with the first name the visitor typed */
    titleNamed: string;
    received: string;
    /** **bold** marks the emphasised words */
    teaser: string;
    back: string;
  };
  clients: { title: string; intro: string; readMore: string; more: string };
  contact: {
    title: string;
    intro: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    interestLegend: string;
    interests: Record<InterestKey, string>;
    message: string;
    optional: string;
    required: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    captchaError: string;
  };
  quote: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    /** {n} and {total} are replaced */
    stepOf: string;
    next: string;
    back: string;
    submit: string;
    sending: string;
    choose: string;
    recap: string;
    contactLegend: string;
    notes: string;
    visit: string;
    /** link under the contact form on the home page */
    link: string;
    steps: QuoteSteps<'framing'>;
  };
  /** The printing quote form (/printing-quote/); shared labels (next, back, recap…) come from `quote` */
  printQuote: { metaTitle: string; metaDescription: string; title: string; intro: string; steps: QuoteSteps<'printing'> };
  /** The dedicated fine art printing page (/fine-art-printing/) */
  printingPage: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogAlt: string;
    crumb: string;
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    imageAlt: string;
    imageCaption: string;
    paper: { title: string; text: string[]; brandsTitle: string; brands: string[]; note: string };
    canvas: { title: string; text: string; specs: string[] };
    printer: { title: string; text: string[] };
    frame: { title: string; text: string; link: string };
    faq: { title: string; items: { q: string; a: string }[] };
    final: { title: string; text: string; cta: string };
    service: { name: string; type: string; description: string };
  };
  footer: { rights: string; visit: string; follow: string; google: string };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
