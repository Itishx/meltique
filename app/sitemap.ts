import type { MetadataRoute } from "next";

import { collections } from "@/lib/collections";
import { articles } from "@/lib/journal";
import { policies } from "@/lib/policies";
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
    { url: url("/flavours"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/journal"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/pre-order"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    /* The policies are listed so a payment gateway's review, and anyone
       looking for the refund terms, can find them without hunting the footer. */
    ...policies.map((policy) => ({
      url: url(`/policies/${policy.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
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
