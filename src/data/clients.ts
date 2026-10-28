/**
 * Client logos shown in "Trusted by many" (permission confirmed by the business).
 * `file` is the basename of an image in src/assets/clients/. An entry whose file is not there
 * yet is skipped at build time, so adding the missing logo is just dropping the file in.
 */
export const clients = [
  { name: 'Sofitel', file: 'sofitel', url: 'https://www.sofitel-phnompenh-phokeethra.com/meetings-events/the-gallery/' },
  { name: 'The Gallerist', file: 'gallerist', url: 'https://www.thegallerist.asia/' },
  { name: 'Raffles Le Royal', file: 'raffles', url: 'https://www.raffles.com/phnom-penh/gallery/' },
  { name: 'ABA Bank', file: 'aba', url: 'https://www.ababank.com/en/aba-news/promoting-art-education-for-cambodian-youth-aba-bank-supports-national/' },
  { name: 'NagaWorld', file: 'naga', url: 'https://www.nagaworld.com/discover/' },
];
