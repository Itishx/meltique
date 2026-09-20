import type { Product } from "./types";

/**
 * Launch pricing.
 *
 * Every box sells for one flat introductory price while the first run is
 * going out. `product.priceInPaise` stays the list price and becomes the
 * struck-through figure, so the discount is visible rather than the
 * catalogue quietly being rewritten — and so there is one number to change
 * when the offer ends.
 *
 * This has to agree with Shopify. The storefront shows what is here; the
 * checkout charges what Shopify holds, so changing this number alone would
 * quote one price and take another.
 *
 * The Mesa POS owns the catalogue in Shopify, so the durable place to change
 * a price is the POS — anything written straight to Shopify is liable to be
 * overwritten by the next POS sync.
 */
export const LAUNCH_PRICE_IN_PAISE = 25000;

/** Set false when the introductory run is over; everything reverts to list. */
export const LAUNCH_PRICING_ACTIVE = true;

export interface Priced {
  /** What the shopper pays, in paise. */
  now: number;
  /** The list price to strike through, or null when there is no saving. */
  was: number | null;
}

export function priceOf(product: Pick<Product, "priceInPaise">): Priced {
  if (!LAUNCH_PRICING_ACTIVE) return { now: product.priceInPaise, was: null };
  return {
    now: LAUNCH_PRICE_IN_PAISE,
    /* Never strike a price that is not actually higher — a "saving" of zero
       or less reads as a trick. */
    was: product.priceInPaise > LAUNCH_PRICE_IN_PAISE ? product.priceInPaise : null,
  };
}

/** What every box costs today. Drives the "from" figures. */
export const currentFromInPaise = LAUNCH_PRICING_ACTIVE
  ? LAUNCH_PRICE_IN_PAISE
  : null;
