import "server-only";

import { products as editorial } from "@/lib/products";
import { isShopifyConfigured } from "./config";
import { storefront } from "./client";
import { PRODUCTS_QUERY } from "./queries";
import { toPaise, type ShopifyProduct } from "./types";

/**
 * What Shopify knows about a product we already have editorial content for.
 *
 * The split is deliberate. lib/products.ts stays the source of truth for
 * story, sensory notes, imagery and materials, because a commerce backend is
 * a poor place to keep writing. Shopify owns price, stock and the variant id
 * needed to actually sell the thing. They are joined on handle == slug.
 */
export interface Commerce {
  variantId: string;
  priceInPaise: number;
  available: boolean;
}

export type CommerceMap = Map<string, Commerce>;

/**
 * Never throws. A Shopify outage, a missing token or a half-populated store
 * must degrade to the pre-order site rather than to an error page, so every
 * failure resolves to an empty map and callers fall back to local prices.
 */
export async function getCommerce(): Promise<CommerceMap> {
  const empty: CommerceMap = new Map();
  if (!isShopifyConfigured) return empty;

  try {
    const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
      PRODUCTS_QUERY,
      { first: 50 },
      /* Prices and stock change; a minute of staleness is a fair trade for
         not hitting Shopify on every render. */
      { revalidate: 60 },
    );

    /* Shopify is keyed by its own handle, which the POS chooses; the rest of
       the site is keyed by our slug. Resolve one to the other here so no
       caller has to know the difference. */
    const slugFor = new Map(
      editorial.map((product) => [product.shopifyHandle ?? product.slug, product.slug]),
    );

    const map: CommerceMap = new Map();
    for (const product of data.products.nodes) {
      const variant = product.variants.nodes[0];
      if (!variant) continue;
      const slug = slugFor.get(product.handle);
      if (!slug) continue;
      map.set(slug, {
        variantId: variant.id,
        priceInPaise: toPaise(variant.price),
        available: product.availableForSale && variant.availableForSale,
      });
    }
    return map;
  } catch (error) {
    console.error("[shopify] catalogue fetch failed, using local prices:", error);
    return empty;
  }
}

/** Which of our products Shopify has not been told about yet. Used by the
 *  setup check so a half-finished import is visible rather than silent. */
export function missingFromShopify(commerce: CommerceMap): string[] {
  return editorial
    .filter((product) => !commerce.has(product.slug))
    .map((product) => product.slug);
}

/** Shopify's price when we have it, ours otherwise. */
export function priceFor(slug: string, fallbackPaise: number, commerce: CommerceMap) {
  return commerce.get(slug)?.priceInPaise ?? fallbackPaise;
}
