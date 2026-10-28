import type { InterestKey } from '../config';

export interface Service {
  title: string;
  text: string;
}

export interface Content {
  /** Km is built but hidden until a native-speaker translation is in place. */
  published: boolean;
  langName: string;
  meta: { title: string; description: string; ogAlt: string };
  ui: {
    skip: string;
    language: string;
    call: string;
    telegram: string;
    opensNewTab: string;
    gallery: string;
    home: string;
  };
  /** Hero H1, one entry per line */
  hero: { eyebrow: string; title: string[]; cta: string; imageAlt: string };
  atelier: { title: string; paragraphs: string[]; cta: string };
  services: { title: string; items: Service[]; cta: string };
  printing: { title: string; paragraphs: string[]; imageAlt: string; cta: string };
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
  footer: { rights: string; visit: string };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
