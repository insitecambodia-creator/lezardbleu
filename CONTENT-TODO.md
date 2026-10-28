# Before launch

Internal checklist, not published on the site.

## Content to confirm

- [ ] **French copy** (`src/i18n/fr.ts`) is a first draft: have it reviewed.
- [ ] **Khmer copy** (`src/i18n/km.ts`): to be written by a native speaker, then `published: true`.
- [ ] **Antiques section** uses the brief's proposed text, with no claims about age, origin or
      authenticity. Add an object photo in `src/assets/antiques/` when available.
- [ ] **Address** `#61, Oknha Chhun (St 240)` and phone: reconfirm (`src/config.ts`).
- [ ] Opening hours, public email and Google Maps pin were not supplied, so they are not shown.
- [ ] Claims carried over unchanged from the live site: "conservation-grade materials",
      "archival pigment inks". Keep only what the business can substantiate (brief §4).
- [ ] Hero image is a staged illustration, not a real project photo. Replace with real work when possible.
- [ ] Original logo (vector) for the header.
- [ ] **Petit Futé quote** (`src/components/Press.astro`, text in `src/i18n/en.ts` and `fr.ts`): the French is
      their wording verbatim (first four sentences of the review, `[…]` marks the cut); the English is our
      translation, labelled as such. Confirm Petit Futé's terms allow quoting it, add the listing URL as
      `petitFuteUrl` in `src/config.ts` (shows a "Read the review" link), and do not use their logo or the
      "Recommandé" badge artwork without permission.
- [ ] **Phone number mismatch**: the Petit Futé listing shows `+855 12 811 678`, the site shows
      `+855 17 935 968`. Confirm which is current and ask Petit Futé to correct their listing if needed.

## Technical

- [ ] Turnstile site key + secret and the n8n webhook URL set in Cloudflare (see README).
- [ ] Consider a consent banner before GTM if EU visitors are a target.
- [ ] Redirects: confirm in Search Console that no other WordPress URLs are indexed before switching the domain.
- [ ] Test the form from the deployed site and confirm the n8n workflow delivers.
- [ ] Brand blue: the site uses `#10273D` (brief); the logo file is about `#005482`. Harmonise.
