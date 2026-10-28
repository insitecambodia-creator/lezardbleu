import { locales, type Locale } from '../config';
import { en } from './en';
import { fr } from './fr';
import { km } from './km';
import type { Content, DeepPartial } from './types';

function merge<T>(base: T, override: DeepPartial<T>): T {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return (override ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override ?? {})) {
    if (value === undefined) continue;
    out[key] = merge((base as Record<string, unknown>)[key], value as never);
  }
  return out as T;
}

const previewKm = import.meta.env.PUBLIC_PREVIEW_KM === '1';

const all: Record<Locale, Content> = {
  en,
  fr,
  km: merge(en, { ...km, published: km.published || previewKm }),
};

export function getContent(locale: Locale): Content {
  return all[locale];
}

export const publishedLocales = locales.filter((l) => all[l].published);

export function localePath(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}/`;
}
