/**
 * Gallery photos, in display order. `file` is the basename of an image in src/assets/gallery/.
 * `alt` is the visible caption in the lightbox and the screen-reader text. Keep it factual: say what is
 * in the photo, not its age, origin or value. Missing languages fall back to English.
 * Photos in the folder that are not listed here are still shown, at the end, without a description.
 */
export interface GalleryItem {
  file: string;
  alt: { en: string; fr?: string; km?: string };
}

export const gallery: GalleryItem[] = [
  { file: 'le-lezard-bleu9', alt: { en: 'Inside the shop on Street 240: framed works on the walls and objects on display', fr: 'Dans la boutique de la rue 240 : œuvres encadrées aux murs et objets exposés' } },
  { file: 'le-lezard-bleu3', alt: { en: 'A bronze figure with several arms, standing in the shop', fr: 'Une statue en bronze à plusieurs bras, dans la boutique' } },
  { file: 'le-lezard-bleu12', alt: { en: 'A grid of framed gold elephants on black', fr: 'Une grille d’éléphants dorés encadrés sur fond noir' } },
  { file: 'le-lezard-bleu2', alt: { en: 'A wall of frame mouldings in gold and dark wood', fr: 'Un mur de moulures de cadres, dorées et en bois foncé' } },
  { file: 'le-lezard-bleu13', alt: { en: 'A display of a large fan with brass ornaments and a blue-and-white teapot', fr: 'Une présentation d’un grand éventail avec des ornements en laiton et une théière bleue et blanche' } },
  { file: 'le-lezard-bleu1', alt: { en: 'A red painted jar with flowers, hanging from a metal stand', fr: 'Un pot rouge peint de fleurs, suspendu à un support en métal' } },
  { file: 'le-lezard-bleu4', alt: { en: 'Shadow-box frames and a seated figure beside a table lamp', fr: 'Des cadres-vitrines et une figure assise près d’une lampe' } },
  { file: 'le-lezard-bleu17', alt: { en: 'An artwork of a classical dancer in a gold headdress, in green and gold', fr: 'Une œuvre représentant une danseuse classique à la coiffe dorée, en vert et or' } },
  { file: 'le-lezard-bleu7', alt: { en: 'Three framed gold elephants in a white mount', fr: 'Trois éléphants dorés encadrés dans un passe-partout blanc' } },
  { file: 'le-lezard-bleu14', alt: { en: 'A seated Buddha figure in the shop', fr: 'Une figure de Bouddha assis dans la boutique' } },
  { file: 'le-lezard-bleu10', alt: { en: 'Seated stone figures on a dark wooden base', fr: 'Des figures assises en pierre sur un socle en bois sombre' } },
  { file: 'le-lezard-bleu16', alt: { en: 'Framed metal medallions in black frames with cream mounts', fr: 'Des médaillons en métal encadrés de noir, avec des passe-partout crème' } },
  { file: 'le-lezard-bleu6', alt: { en: 'Bronze figures on a wooden table', fr: 'Des figures en bronze sur une table en bois' } },
  { file: 'le-lezard-bleu11', alt: { en: 'A bronze sculpture of hands in a graceful gesture', fr: 'Une sculpture en bronze de mains dans un geste gracieux' } },
  { file: 'le-lezard-bleu5', alt: { en: 'Framed pieces on a table beside a lamp', fr: 'Des pièces encadrées sur une table, près d’une lampe' } },
  { file: 'le-lezard-bleu15', alt: { en: 'The shop seen through glass, with framed pictures on the walls', fr: 'La boutique vue à travers une vitre, avec des tableaux encadrés aux murs' } },
  { file: 'le-lezard-bleu8', alt: { en: 'A carved wooden object in the foreground, framed pieces behind', fr: 'Un objet en bois sculpté au premier plan, des pièces encadrées derrière' } },
];
