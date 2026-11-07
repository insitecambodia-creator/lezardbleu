/**
 * The quote-form questions, shared by the pages (src/components/QuoteForm.astro) and the Worker
 * (worker/index.ts). Keep this file free of Vite-only code (no import.meta.env): the Worker bundles it too.
 *
 * Two forms use it:
 *  - framing: "Lezard Bleu Framing Customer Questions", section C (short website / quotation form)
 *  - printing: the fine art printing quote (what to print, file, paper or canvas, size, finishing, timing)
 * Each answer is one of a fixed list of keys; the English labels are what the shop reads in the n8n message.
 */
export const QUOTE_FORMS = {
  framing: {
    formType: 'framing-quote',
    title: 'Framing quote request',
    options: {
      item: ['photograph', 'artwork', 'poster', 'object', 'other'],
      have: ['physical', 'digital', 'advice'],
      size: ['small', 'medium', 'large', 'unsure'],
      style: ['modern', 'classic', 'wood', 'advice'],
      timing: ['asap', 'week', 'none'],
    },
    labels: {
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
        options: { asap: 'As soon as possible', week: 'Within a week', none: 'No particular deadline' },
      },
    },
  },
  printing: {
    formType: 'printing-quote',
    title: 'Printing quote request',
    options: {
      what: ['photograph', 'artwork', 'digital', 'other'],
      have: ['digital', 'original', 'advice'],
      media: ['paper', 'canvas', 'unsure'],
      size: ['small', 'medium', 'large', 'unsure'],
      finish: ['print', 'framed', 'stretched', 'unsure'],
      timing: ['asap', 'week', 'none'],
    },
    labels: {
      what: {
        question: 'What to print',
        options: {
          photograph: 'Photograph',
          artwork: 'Reproduction of an artwork',
          digital: 'Digital artwork',
          other: 'Other',
        },
      },
      have: {
        question: 'Has the file',
        options: {
          digital: 'Has a digital file',
          original: 'Has the original (would like advice)',
          advice: 'Needs advice',
        },
      },
      media: {
        question: 'Paper or canvas',
        options: { paper: 'Fine art paper', canvas: 'Canvas', unsure: 'Not sure (would like advice)' },
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
      finish: {
        question: 'After printing',
        options: {
          print: 'Print only',
          framed: 'Print and frame it',
          stretched: 'Stretch the canvas',
          unsure: 'Not sure',
        },
      },
      timing: {
        question: 'Needed',
        options: { asap: 'As soon as possible', week: 'Within a week', none: 'No particular deadline' },
      },
    },
  },
} as const;

export type QuoteKind = keyof typeof QUOTE_FORMS;
export const QUOTE_KINDS = Object.keys(QUOTE_FORMS) as QuoteKind[];
export type QuoteAnswers = Record<string, string>;

/** Questions of a form, in order. */
export const quoteKeys = (kind: QuoteKind): string[] => Object.keys(QUOTE_FORMS[kind].options);

/** The form behind a submitted `formType` ('framing-quote', 'printing-quote'), or null if unknown. */
export function quoteKindFromFormType(formType: unknown): QuoteKind | null {
  return QUOTE_KINDS.find((k) => QUOTE_FORMS[k].formType === formType) ?? null;
}

/** Returns the answers if every question has one of its allowed values, otherwise null. */
export function parseQuote(kind: QuoteKind, input: unknown): QuoteAnswers | null {
  if (typeof input !== 'object' || input === null) return null;
  const options = QUOTE_FORMS[kind].options as Record<string, readonly string[]>;
  const out: QuoteAnswers = {};
  for (const key of Object.keys(options)) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value !== 'string' || !options[key].includes(value)) return null;
    out[key] = value;
  }
  return out;
}

/** The summary that goes at the top of the message sent to n8n, in English. */
export function quoteSummary(kind: QuoteKind, answers: QuoteAnswers): string {
  const labels = QUOTE_FORMS[kind].labels as Record<string, { question: string; options: Record<string, string> }>;
  const lines = Object.keys(labels).map((k) => `• ${labels[k].question}: ${labels[k].options[answers[k]]}`);
  return [QUOTE_FORMS[kind].title, ...lines].join('\n');
}

/** Topics ticked for the sheet's "Type" column. */
export function quoteInterests(kind: QuoteKind, answers: QuoteAnswers): string[] {
  if (kind === 'framing') return answers.have === 'digital' ? ['framing', 'printing'] : ['framing'];
  return answers.finish === 'framed' ? ['printing', 'framing'] : ['printing'];
}
