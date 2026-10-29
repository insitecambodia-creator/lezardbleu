/**
 * The framing-quote questions, shared by the page (src/components/QuoteForm.astro) and the Worker
 * (worker/index.ts). Keep this file free of Vite-only code (no import.meta.env): the Worker bundles it too.
 * Source of the questions: "Lezard Bleu Framing Customer Questions", section C (short website / quotation form).
 */
export const QUOTE_OPTIONS = {
  item: ['photograph', 'artwork', 'poster', 'object', 'other'],
  have: ['physical', 'digital', 'advice'],
  size: ['small', 'medium', 'large', 'unsure'],
  style: ['modern', 'classic', 'wood', 'advice'],
  timing: ['asap', 'week', 'none'],
} as const;

export type QuoteKey = keyof typeof QUOTE_OPTIONS;
export const QUOTE_KEYS = Object.keys(QUOTE_OPTIONS) as QuoteKey[];
export type QuoteAnswers = { [K in QuoteKey]: (typeof QUOTE_OPTIONS)[K][number] };

/** English wording of each question and answer: what the shop reads in the n8n message and Google Sheet. */
export const QUOTE_LABELS: Record<QuoteKey, { question: string; options: Record<string, string> }> = {
  item: {
    question: 'What to frame',
    options: {
      photograph: 'Photograph',
      artwork: 'Artwork / painting',
      poster: 'Poster / certificate',
      object: 'Object / memorabilia',
      other: 'Other',
    },
  },
  have: {
    question: 'Has the item',
    options: {
      physical: 'Yes, has the physical item',
      digital: 'Has a digital file to print',
      advice: 'Needs advice',
    },
  },
  size: {
    question: 'Approximate size',
    options: {
      small: 'Small (up to A4)',
      medium: 'Medium (up to A2)',
      large: 'Large (larger than A2)',
      unsure: 'Not sure',
    },
  },
  style: {
    question: 'Frame style',
    options: {
      modern: 'Modern / minimalist',
      classic: 'Classic / traditional',
      wood: 'Natural wood',
      advice: 'Would like advice',
    },
  },
  timing: {
    question: 'Needed',
    options: {
      asap: 'As soon as possible',
      week: 'Within a week',
      none: 'No particular deadline',
    },
  },
};

/** "Framing quote request" summary that goes at the top of the message sent to n8n. */
export function quoteSummary(answers: QuoteAnswers): string {
  const lines = QUOTE_KEYS.map((k) => `• ${QUOTE_LABELS[k].question}: ${QUOTE_LABELS[k].options[answers[k]]}`);
  return ['Framing quote request', ...lines].join('\n');
}

/** Returns the answers if every question has one of its allowed values, otherwise null. */
export function parseQuote(input: unknown): QuoteAnswers | null {
  if (typeof input !== 'object' || input === null) return null;
  const out: Record<string, string> = {};
  for (const key of QUOTE_KEYS) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value !== 'string' || !(QUOTE_OPTIONS[key] as readonly string[]).includes(value)) return null;
    out[key] = value;
  }
  return out as QuoteAnswers;
}
