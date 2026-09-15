export interface Policy {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

/**
 * Policy copy is deliberately unfinished. Terms that carry legal or commercial
 * commitments are marked as pending rather than drafted here.
 */
const PENDING = "This section is being finalised and will be published before launch.";

export const policies: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping",
    summary: "Where we deliver, what it costs, and how long it takes.",
    sections: [
      { heading: "Delivery areas", body: [PENDING] },
      { heading: "Charges", body: [PENDING] },
      { heading: "Timings", body: [PENDING] },
      {
        heading: "Warm weather",
        body: [
          "Chocolate is temperature-sensitive. In warmer months we may hold or repack orders to protect them in transit; the approach will be confirmed here before launch.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    summary: "What can be returned, and what to do if something arrives damaged.",
    sections: [
      {
        heading: "Damaged or incorrect orders",
        body: [
          "If an order arrives damaged or is not what you ordered, contact us with a photograph and your order number and we will put it right.",
        ],
      },
      { heading: "Change of mind", body: [PENDING] },
      { heading: "Refund timings", body: [PENDING] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary: "What we collect, why, and how long we keep it.",
    sections: [
      { heading: "What we collect", body: [PENDING] },
      { heading: "How it is used", body: [PENDING] },
      { heading: "Your rights", body: [PENDING] },
      {
        heading: "Contact",
        body: ["Privacy questions can be sent through the contact page."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    summary: "The terms that apply when you order from MELTYK.",
    sections: [
      { heading: "Orders", body: [PENDING] },
      { heading: "Pricing", body: ["Prices shown on the site are provisional until confirmed."] },
      { heading: "Liability", body: [PENDING] },
    ],
  },
];

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
