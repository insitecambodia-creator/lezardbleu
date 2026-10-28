/** Facts that do not change per language. Edit here, not in the components. */
export const site = {
  name: 'Le Lezard Bleu',
  url: 'https://www.lezard-bleu.com',
  phone: { display: '+855 17 935 968', href: 'tel:+85517935968' },
  telegram: 'https://t.me/lezard_bleu',
  // Reconfirm before launch (see CONTENT-TODO.md).
  address: {
    street: '#61, Oknha Chhun (St 240)',
    locality: 'Phnom Penh',
    country: 'KH',
    countryName: 'Cambodia',
  },
  gtmId: import.meta.env.PUBLIC_GTM_ID || 'GTM-MRLX8NV6',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
} as const;

/** Enquiry topics. The keys are what n8n receives, whatever the page language. */
export const interestKeys = ['framing', 'printing', 'restoration', 'antiques'] as const;
export type InterestKey = (typeof interestKeys)[number];

export const locales = ['en', 'fr', 'km'] as const;
export type Locale = (typeof locales)[number];
