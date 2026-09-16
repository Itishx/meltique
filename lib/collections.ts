import { products } from "./products";
import type { Product } from "./types";

export interface Collection {
  slug: string;
  order: number;
  name: string;
  kicker: string;
  intro: string;
  note: string;
  image: { src: string; alt: string };
  productSlugs: string[];
}

export const collections: Collection[] = [
  {
    slug: "the-four",
    order: 1,
    name: "The Four",
    kicker: "Start here",
    intro: "Four distinct flavours. One signature form.",
    note: "Meltyk Muse, Caramel, Fruit & Nut and Protein. The same cube, the same clean edges, four entirely different arguments about what a piece of chocolate should do. Buy them singly or take all four.",
    image: {
      src: "/images/collections/flavours.jpg",
      alt: "The four Meltyk wrappers scattered together in black, copper, burgundy and ivory",
    },
    productSlugs: ["meltyk-muse", "caramel-crunch", "fruit-nut", "protein"],
  },
  {
    slug: "assorted",
    order: 2,
    name: "Assorted",
    kicker: "All four, boxed",
    intro: "Six, ten or twenty cubes in one tray.",
    note: "A curated selection of four flavours, wrapped and set in colour lanes. The box reads as a set of colours before it reads as chocolate, which is the point, you choose with your eyes first.",
    image: {
      src: "/images/collections/assorted.jpg",
      alt: "The Meltyk assorted box open, wrapped cubes arranged in four colour lanes",
    },
    productSlugs: ["assorted", "caramel-crunch", "meltyk-muse"],
  },
  {
    slug: "gifting",
    order: 3,
    name: "Gifting",
    kicker: "Ready to hand over",
    intro: "Ribbon-tied, tagged and written by hand.",
    note: "Gifting is the Experience layer made buyable: satin ribbon, a foil-blocked hang tag, a message written rather than printed. Everything here arrives finished.",
    image: {
      src: "/images/collections/gifting.jpg",
      alt: "A Meltyk box tied with satin ribbon and a foil-blocked hang tag",
    },
    productSlugs: ["assorted", "caramel-crunch", "fruit-nut"],
  },
  {
    slug: "everyday",
    order: 4,
    name: "Everyday",
    kicker: "Pocket format",
    intro: "The tube, the single cube, the desk drawer.",
    note: "Not every moment needs a box. The tube closes again after you take one, and the single cube is the smallest thing we sell, anytime, anywhere.",
    image: {
      src: "/images/collections/everyday.jpg",
      alt: "The Meltyk tube lying beside four wrapped cubes",
    },
    productSlugs: ["protein", "meltyk-muse", "assorted"],
  },
];

const bySlug = new Map(collections.map((c) => [c.slug, c]));

export function getCollection(slug: string): Collection | undefined {
  return bySlug.get(slug);
}

export function collectionProducts(collection: Collection): Product[] {
  return collection.productSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}
