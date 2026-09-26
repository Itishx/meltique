import type { MetadataRoute } from "next";

import { collections } from "@/lib/collections";
import { articles } from "@/lib/journal";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const now = new Date();

  return [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/collections"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/gifting"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/our-story"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/journal"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...products.map((product) => ({
      url: url(`/product/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...collections.map((collection) => ({
      url: url(`/collections/${collection.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: url(`/journal/${article.slug}`),
      lastModified: new Date(article.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
