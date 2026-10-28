import type { Content, DeepPartial } from './types';

/**
 * Khmer copy: NOT written yet. Anything left out here falls back to English (see index.ts).
 * The /km/ pages are not built, and the language switcher hides Khmer, until `published` is
 * set to true after a native speaker has translated and reviewed the text.
 * To preview the layout in the meantime, run `PUBLIC_PREVIEW_KM=1 npm run dev`.
 */
export const km: DeepPartial<Content> = {
  published: false,
  langName: 'ខ្មែរ',
};
