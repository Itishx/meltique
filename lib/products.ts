import type { Occasion, Product } from "./types";

/**
 * The MELTYK range.
 *
 * One format — a Box of 4 — in five versions: each of the four flavours on its
 * own, and the assorted box with one cube of every flavour. Prices are
 * provisional placeholders until the brand confirms them.
 */

const STORAGE =
  "Store cool and dry, away from direct sunlight. Shelf life to be confirmed.";

const GIFT_MATERIALS = [
  "Rigid box, soft-touch finish",
  "Foil-blocked logotype on the lid",
  "Moulded tray, one well per cube",
];

export const products: Product[] = [
  {
    slug: "classic-dark",
    name: "Classic Dark",
    tagline: "Bold. Pure. Timeless.",
    summary: "Four dark chocolate cubes, solid the whole way through.",
    swatch: "#1c1917",
    backdrop: "#4d1b0c",
    inside: "Intense dark chocolate",
    insideImage: {
      src: "/images/inside/classic-dark.jpg",
      alt: "A Meltyk Classic Dark cube broken in two, showing dense dark chocolate through the break",
    },
    insideSquare: {
      src: "/images/inside/classic-dark-square.jpg",
      alt: "A Meltyk Classic Dark cube broken in two, showing dense dark chocolate through the break",
    },
    poster: {
      src: "/images/posters/classic-dark.jpg",
      alt: "Meltyk Classic Dark poster, dark chocolate squares under a pour of melted chocolate",
      ground: "#4d1b0c",
    },
    boxImage: {
      src: "/images/boxes/classic-dark.jpg",
      alt: "A MELTYK Box of 4 Classic Dark, open on four M-embossed dark chocolate cubes",
    },
    weight: "4 cubes · 48 g",
    priceInPaise: 35000,
    sensoryNotes: ["Dark cocoa", "Roasted", "Long finish"],
    story: [
      "The cube in its plainest form: dark chocolate, set into the signature shape and wrapped once it has firmed.",
      "No centre and no filling, which is why the break is the only thing worth photographing.",
    ],
    ingredients: ["Cocoa mass", "Cocoa butter", "Sugar", "Vanilla"],
    allergens: ["May contain traces of milk, tree nuts and soy."],
    dietary: [],
    storage: STORAGE,
    materials: GIFT_MATERIALS,
    occasions: ["For someone you love", "Thank you"],
    featured: true,
    images: [
      { src: "/images/posters/classic-dark.jpg", alt: "Meltyk Classic Dark, dark chocolate under a pour of melted chocolate" },
      { src: "/images/inside/classic-dark-square.jpg", alt: "A Classic Dark cube broken open, solid chocolate through the break" },
      { src: "/images/products/cube-classic-dark/1.jpg", alt: "A Classic Dark cube with its embossed M, beside the black wrapper" },
    ],
    related: ["caramel-crunch", "assorted", "fruit-nut"],
  },
  {
    slug: "caramel-crunch",
    name: "Caramel Crunch",
    tagline: "Smooth. Buttery. Addictive.",
    summary: "Four cubes with a caramel centre and a crunch running through it.",
    swatch: "#a35939",
    backdrop: "#c38930",
    inside: "Flowing caramel centre",
    insideImage: {
      src: "/images/inside/caramel.jpg",
      alt: "A Meltyk Caramel Crunch cube broken open, its caramel centre embedded in milk chocolate",
    },
    insideSquare: {
      src: "/images/inside/caramel-square.jpg",
      alt: "A Meltyk Caramel Crunch cube broken open, its caramel centre embedded in milk chocolate",
    },
    poster: {
      src: "/images/posters/caramel.jpg",
      alt: "Meltyk Caramel Crunch poster, caramel chocolate under a pour of melted caramel",
      ground: "#c38930",
    },
    boxImage: {
      src: "/images/boxes/caramel-crunch.jpg",
      alt: "A MELTYK Box of 4 Caramel Crunch, open on four cubes with caramel and hazelnut crunch",
    },
    weight: "4 cubes · 48 g",
    priceInPaise: 37500,
    sensoryNotes: ["Caramel", "Butter", "Crunch"],
    story: [
      "Caramel is held in the centre of the cube rather than poured into a shell, so the chocolate wall stays intact right up to the break.",
      "The crunch is what stops it being only sweet.",
    ],
    ingredients: ["Cocoa mass", "Cocoa butter", "Sugar", "Milk solids", "Caramel", "Vanilla"],
    allergens: ["Contains milk. May contain traces of tree nuts and soy."],
    dietary: [],
    storage: STORAGE,
    materials: GIFT_MATERIALS,
    occasions: ["For someone you love", "Celebration"],
    featured: true,
    images: [
      { src: "/images/products/box-of-4/1.jpg", alt: "A Meltyk Caramel Crunch Box of 4 open on stone, four M-embossed cubes in a fitted tray" },
      { src: "/images/products/box-of-4/2.jpg", alt: "The four Caramel Crunch cubes in their tray, each embossed with an M" },
      { src: "/images/posters/caramel.jpg", alt: "Meltyk Caramel Crunch poster, caramel chocolate under a pour of melted caramel" },
      { src: "/images/inside/caramel-square.jpg", alt: "A Caramel Crunch cube broken open, caramel centre embedded in chocolate" },
    ],
    related: ["assorted", "classic-dark", "protein"],
  },
  {
    slug: "fruit-nut",
    name: "Fruit & Nut",
    tagline: "Fruity. Crunchy. Indulgent.",
    summary: "Four cubes packed edge to edge with whole nuts and dried fruit.",
    swatch: "#662628",
    backdrop: "#591f30",
    inside: "Real fruits & crunchy nuts",
    insideImage: {
      src: "/images/inside/fruit-nut.jpg",
      alt: "A Meltyk Fruit & Nut cube broken open, almonds and dried fruit sliced flush with the break",
    },
    insideSquare: {
      src: "/images/inside/fruit-nut-square.jpg",
      alt: "A Meltyk Fruit & Nut cube broken open, almonds and dried fruit sliced flush with the break",
    },
    poster: {
      src: "/images/posters/fruit-nut.jpg",
      alt: "Meltyk Fruit & Nut poster, fruit and nut studded chocolate under a pour",
      ground: "#591f30",
    },
    boxImage: {
      src: "/images/boxes/fruit-nut.jpg",
      alt: "A MELTYK Box of 4 Fruit & Nut, open on four cubes studded with nuts and dried fruit",
    },
    weight: "4 cubes · 56 g",
    priceInPaise: 39500,
    sensoryNotes: ["Dried fruit", "Toasted nut", "Dark cocoa"],
    story: [
      "Nuts and dried fruit are suspended through the whole cube rather than scattered on top, so every break shows a different cross-section.",
      "The heaviest cube in the range, and the one that takes longest to eat.",
    ],
    ingredients: ["Cocoa mass", "Cocoa butter", "Sugar", "Almonds", "Hazelnuts", "Dried cranberries", "Vanilla"],
    allergens: ["Contains almonds and hazelnuts. May contain traces of milk, other tree nuts and soy."],
    dietary: [],
    storage: STORAGE,
    materials: GIFT_MATERIALS,
    occasions: ["Celebration", "Thank you"],
    featured: true,
    images: [
      { src: "/images/posters/fruit-nut.jpg", alt: "Meltyk Fruit & Nut poster, fruit and nut studded chocolate under a pour" },
      { src: "/images/inside/fruit-nut-square.jpg", alt: "A Fruit & Nut cube broken open, nuts and fruit sliced flush with the break" },
      { src: "/images/products/cube-fruit-nut/1.jpg", alt: "A Fruit & Nut cube with its embossed M, beside the burgundy wrapper" },
    ],
    related: ["protein", "assorted", "caramel-crunch"],
  },
  {
    slug: "protein",
    name: "Protein",
    tagline: "Power. In pleasure.",
    summary: "Four crunchier cubes built around nuts, seeds and puffed grains.",
    swatch: "#d0c1b5",
    backdrop: "#8c070a",
    inside: "Nutrient-rich blend",
    insideImage: {
      src: "/images/inside/protein.jpg",
      alt: "A Meltyk Protein cube broken open, nuts, seeds and puffed grains packed through the chocolate",
    },
    insideSquare: {
      src: "/images/inside/protein-square.jpg",
      alt: "A Meltyk Protein cube broken open, nuts, seeds and puffed grains packed through the chocolate",
    },
    poster: {
      src: "/images/posters/protein.jpg",
      alt: "Meltyk Protein poster, protein-rich chocolate under a pour",
      ground: "#8c070a",
    },
    boxImage: {
      src: "/images/boxes/protein.jpg",
      alt: "A MELTYK Box of 4 Protein, open on four cubes with seeds and puffed grains",
    },
    weight: "4 cubes · 56 g",
    priceInPaise: 42500,
    sensoryNotes: ["Toasted nut", "Seed", "Puffed grain"],
    story: [
      "Nuts, seeds and puffed grains packed densely enough that the cube holds together on texture as much as on chocolate.",
      "Protein content to be confirmed on the final recipe.",
    ],
    ingredients: ["Cocoa mass", "Cocoa butter", "Sugar", "Milk solids", "Almonds", "Pumpkin seeds", "Puffed grains"],
    allergens: ["Contains milk and almonds. May contain traces of other tree nuts, soy and gluten."],
    dietary: [],
    storage: STORAGE,
    materials: GIFT_MATERIALS,
    occasions: ["Thank you", "Corporate"],
    featured: true,
    images: [
      { src: "/images/posters/protein.jpg", alt: "Meltyk Protein poster, protein-rich chocolate under a pour" },
      { src: "/images/inside/protein-square.jpg", alt: "A Protein cube broken open, nuts and seeds packed through the chocolate" },
      { src: "/images/products/cube-protein/1.jpg", alt: "A Protein cube with its embossed M, beside the ivory wrapper" },
    ],
    related: ["fruit-nut", "assorted", "classic-dark"],
  },
  {
    slug: "assorted",
    name: "The Assorted Box",
    tagline: "One of each. The whole range, once.",
    summary: "Four cubes, one of every flavour, in the signature box.",
    swatch: "#8a5c31",
    backdrop: "#241711",
    weight: "4 cubes · 52 g",
    priceInPaise: 39900,
    sensoryNotes: ["Classic Dark", "Caramel Crunch", "Fruit & Nut", "Protein"],
    story: [
      "One cube of each flavour, wrapped in its own colour and set in a fitted tray.",
      "The shortest way to taste the whole range, and the box most people give away rather than keep.",
    ],
    ingredients: ["See each flavour for its full ingredient list."],
    allergens: ["Contains milk, almonds and hazelnuts. May contain traces of other tree nuts, soy and gluten."],
    dietary: [],
    storage: STORAGE,
    materials: GIFT_MATERIALS,
    occasions: ["For someone you love", "Celebration", "Corporate"],
    featured: true,
    assorted: true,
    images: [
      { src: "/images/products/assorted-box/1.jpg", alt: "The Meltyk assorted Box of 4 open beside its lid, one cube of each flavour in a fitted tray" },
      { src: "/images/products/assorted-box/2.jpg", alt: "The assorted tray, dark, caramel, fruit and nut, and protein cubes, each embossed with an M" },
      { src: "/images/products/assorted-box/3.jpg", alt: "The assorted box lid, foil-blocked Meltyk logotype over a debossed monogram" },
      { src: "/images/editorial/wrappers.jpg", alt: "The four Meltyk wrappers laid side by side" },
    ],
    related: ["caramel-crunch", "classic-dark", "fruit-nut"],
  },
];

/* ------------------------------------------------------------------ lookups */

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

/** The four single-flavour boxes, in brand order. */
export const flavours = products.filter((p) => !p.assorted);

/** The box with one of each. */
export const assortedBox = bySlug.get("assorted");

/** Lowest price in the range, for "from" copy. */
export const fromPriceInPaise = Math.min(...products.map((p) => p.priceInPaise));

export function getFeatured(limit = 5): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelated(product: Product, limit = 3): Product[] {
  const picked = (product.related ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Product => Boolean(p));

  if (picked.length >= limit) return picked.slice(0, limit);

  const fallback = products.filter(
    (p) => p.slug !== product.slug && !picked.some((q) => q.slug === p.slug),
  );
  return [...picked, ...fallback].slice(0, limit);
}

export function getByOccasion(occasion: Occasion): Product[] {
  return products.filter((p) => p.occasions.includes(occasion));
}

export const occasions: Occasion[] = [
  "For someone you love",
  "Thank you",
  "Celebration",
  "Corporate",
];
