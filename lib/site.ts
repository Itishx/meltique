export const site = {
  name: "Meltyk",
  nameUpper: "MELTYK",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://meltyk.com",
  tagline: "Made to melt.",
  /** What the brand is for. */
  promise: "Chocolate made to be given.",
  description:
    "MELTYK makes chocolate cubes in four flavours, sold one way: a Box of 4. Either four of one flavour, or one of each. Made to melt, made to be given.",

  /** Commerce is not live; everything price- or delivery-shaped is provisional. */
  pricingIsProvisional: true,
  provisionalNote: "Indicative pricing. Final prices confirmed at pre-order.",
  deliveryNote: "Delivery options and timings to be confirmed.",
  preOrderNote:
    "Pre-orders are being collected ahead of the first run. Nothing is charged now.",
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
