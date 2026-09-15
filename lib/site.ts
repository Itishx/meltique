export const site = {
  name: "Meltyk",
  nameUpper: "MELTYK",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://meltyk.com",
  tagline: "Made to melt.",
  /** What the brand is for. */
  promise: "Chocolate made to be given.",
  description:
    "MELTYK makes chocolate cubes in four flavours, sold one way: a Box of 4. Either four of one flavour, or one of each. Made to melt, made to be given.",

  /** Commerce is live through Shopify; prices and delivery are real at
   *  checkout, so the old "to be confirmed" hedging is gone. */
  pricingIsProvisional: false,
  provisionalNote: "Prices include GST where applicable.",
  deliveryNote: "Delivery is calculated at checkout from your address.",
  preOrderNote:
    "Pre-orders are open ahead of the first run. Checkout and payment are handled by Shopify.",
} as const;

/**
 * The launch offers.
 *
 * One place, because these numbers appear in four: the announcement bar, the
 * cart's delivery meter, the discount created in Shopify, and the shipping
 * rate that has to back it up.
 *
 * IMPORTANT: `freeDeliveryOverPaise` must match a real Shopify shipping rule.
 * The storefront cannot see shipping rules until a cart has an address, so
 * nothing here can verify itself — if Shopify has no free tier at this
 * threshold, the meter promises something checkout will not honour.
 * Set the rate under Settings -> Shipping and delivery to match.
 */
export const offers = {
  /** Cart subtotal, in paise, at which delivery stops being charged. */
  freeDeliveryOverPaise: 99900,

  promo: {
    /** Must match the code created by scripts/shopify-discount.mjs. */
    code: "FIRSTMELT",
    percentOff: 15,
    /** Shown in the announcement bar. Keep it to one short line. */
    line: "15% off the first run",
    /** Phone width. The code must never be the thing that gets truncated,
     *  so the description shortens instead. */
    shortLine: "15% off",
  },
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/flavours", label: "Flavours" },
  { href: "/gifting", label: "Gifting" },
  { href: "/our-story", label: "Our Story" },
  { href: "/pre-order", label: "Pre-order" },
] as const;

export const footerNav = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "The Box of 4" },
      { href: "/product/assorted", label: "Assorted box" },
      { href: "/flavours", label: "The four flavours" },
      { href: "/gifting", label: "Gifting" },
      { href: "/pre-order", label: "Pre-order" },
    ],
  },
  {
    heading: "MELTYK",
    links: [
      { href: "/our-story", label: "Our story" },
      { href: "/journal", label: "Journal" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { href: "/policies/shipping", label: "Shipping" },
      { href: "/policies/returns", label: "Returns" },
      { href: "/policies/privacy", label: "Privacy" },
      { href: "/policies/terms", label: "Terms" },
    ],
  },
] as const;
