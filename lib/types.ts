/**
 * MELTYK sells one format: a Box of 4.
 *
 * Either four cubes of a single flavour, or the assorted box with one of each.
 * There are no single cubes and no larger packs.
 */
export type Occasion =
  | "For someone you love"
  | "Thank you"
  | "Celebration"
  | "Corporate";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  slug: string;
  /** The flavour, or "The Assorted Box". */
  name: string;
  /** Short descriptor: "Bold. Pure. Timeless." */
  tagline: string;
  /** One line for cards and grids. */
  summary: string;
  /** Wrapper colour, sampled from the shoot. Drives the accent rule. */
  swatch: string;
  backdrop: string;
  /** What the cube reveals when it breaks. */
  inside?: string;
  insideImage?: { src: string; alt: string };
  insideSquare?: { src: string; alt: string };
  /** Vertical flavour poster, on its own ground colour. Used whole. */
  poster?: { src: string; alt: string; ground: string };
  /** The box of four for this flavour. Shop page only. */
  boxImage?: { src: string; alt: string };
  /** Always four cubes; the weight varies a little by flavour. */
  weight: string;
  /** Provisional — see `site.pricingIsProvisional`. */
  priceInPaise: number;
  sensoryNotes: string[];
  story: string[];
  ingredients: string[];
  /** Left empty until lab values are confirmed. */
  nutrition?: { label: string; value: string }[];
  allergens: string[];
  dietary: string[];
  storage: string;
  materials: string[];
  occasions: Occasion[];
  images: ProductImage[];
  /** The box with one cube of every flavour. */
  /**
   * The handle this product has in Shopify, when it differs from `slug`.
   *
   * The catalogue is pushed from the Mesa POS, which names its own handles.
   * Renaming them in Shopify would only last until the next POS sync, so the
   * mapping lives here instead.
   */
  shopifyHandle?: string;
  assorted?: boolean;
  featured?: boolean;
  related?: string[];
}
