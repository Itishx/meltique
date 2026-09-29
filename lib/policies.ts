import { business, offers } from "./site";
import { formatPrice } from "./format";

export interface Policy {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

/**
 * The published policies.
 *
 * These carry real commercial and legal commitments, so the figures in them
 * are read from lib/site.ts rather than typed out again: the free-delivery
 * threshold here has to be the same number the cart's meter promises and the
 * same number Shopify's shipping rule enforces. Three copies of it would
 * eventually disagree, and the one customers would quote back is this one.
 */

const FLAT_DELIVERY_IN_PAISE = 7000;

const CONTACT = `Write to ${business.email} or call ${business.phone}, quoting your order number.`;

export const policies: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping",
    summary: "Where we deliver, what it costs, and how long it takes.",
    sections: [
      {
        heading: "Delivery areas",
        body: [
          "We deliver anywhere in India that our courier partners reach. We do not ship outside India at present.",
          "If a pin code cannot be serviced, checkout will tell you before you pay rather than after.",
        ],
      },
      {
        heading: "Charges",
        body: [
          `Delivery is a flat ${formatPrice(FLAT_DELIVERY_IN_PAISE)} anywhere in India, and free on orders over ${formatPrice(offers.freeDeliveryOverPaise)}.`,
          "The exact charge is shown at checkout before payment. There are no charges added after you pay.",
        ],
      },
      {
        heading: "Timings",
        body: [
          `Orders are dispatched within two working days and delivered within ${business.deliveryDays} working days of being placed. Orders placed on a Sunday or a public holiday are processed the next working day.`,
          "Tracking details are emailed to you as soon as the parcel leaves us.",
        ],
      },
      {
        heading: "Warm weather",
        body: [
          "Chocolate is temperature-sensitive. In the hotter months we may hold a parcel for a day or repack it to protect it in transit, and we would rather your box arrive a day late than arrive soft.",
          "If a box does arrive melted, it is covered — see the refunds and cancellations policy.",
        ],
      },
      {
        heading: "Questions about a delivery",
        body: [CONTACT],
      },
    ],
  },
  {
    slug: "returns",
    title: "Refunds & Cancellations",
    summary:
      "What happens if a box arrives damaged, melted or wrong, and when an order can be cancelled.",
    sections: [
      {
        heading: "Damaged, melted or incorrect orders",
        body: [
          `If your box arrives damaged, melted, or is not what you ordered, we will replace it or refund it in full. Send us a photograph of the box within ${business.reportWindowHours} hours of delivery, along with your order number, and we will arrange it.`,
          "You do not need to send the original box back to us, and you are not charged delivery on a replacement.",
        ],
      },
      {
        heading: "Orders that do not arrive",
        body: [
          `If a parcel is not delivered within ${business.deliveryDays} working days, tell us and we will either resend it or refund it in full. That is your choice, not ours.`,
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "Orders go into production as soon as they are placed, so an order cannot be cancelled once it has been confirmed at checkout.",
          "If we cannot fulfil an order — a flavour sells out, a pin code turns out to be unserviceable, or a price is listed in error — we will cancel it ourselves and refund you in full. We will always tell you before we do.",
        ],
      },
      {
        heading: "Change of mind",
        body: [
          "Chocolate is a perishable food product and boxes are sealed, so we cannot accept a return simply because you changed your mind. This does not affect anything above: a box that arrives damaged, melted, wrong or late is always covered.",
        ],
      },
      {
        heading: "Refund timings",
        body: [
          `Approved refunds are sent back to the original payment method within ${business.refundDays} working days. Your bank may take a few days more to show it.`,
          CONTACT,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary: "What we collect, why, and how long we keep it.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order we collect your name, email address, phone number, delivery address and what you ordered. If you write to us, we keep that correspondence.",
          "We never see or store your card, UPI or netbanking details. Payment is handled entirely by our payment gateway, and those details do not pass through this website.",
        ],
      },
      {
        heading: "How it is used",
        body: [
          "To take your order, deliver it, answer questions about it, and meet our tax and accounting obligations. Nothing else.",
          "We do not sell your data, and we do not share it with anyone for advertising.",
        ],
      },
      {
        heading: "Who else processes it",
        body: [
          "Shopify runs our store and checkout. Razorpay processes payments. Vercel hosts this website. Our courier partner receives your name, address and phone number so that they can deliver your parcel. Each of them only receives what they need to do that job.",
          "This site runs no analytics, advertising or email-marketing tools of its own.",
        ],
      },
      {
        heading: "Cookies and local storage",
        body: [
          "Your cart is kept in your own browser's local storage so that it survives a refresh. It stays on your device and is never sent to us. Clearing your browser data clears it.",
          "Shopify sets the cookies it needs to run a checkout securely.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Order records are kept for as long as tax and accounting rules require. Anything we do not need, we delete.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Write to ${business.email} and we will action it within 30 days. Where an order record must be kept for tax reasons, we will tell you.`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    summary: "The terms that apply when you order from MELTYK.",
    sections: [
      {
        heading: "Who you are buying from",
        body: [
          `MELTYK is a trading name of ${business.legalName}, a ${business.entityType.toLowerCase()} based at ${business.addressLine}.`,
          `You can reach us at ${business.email} or ${business.phone}.`,
        ],
      },
      {
        heading: "Orders",
        body: [
          "Placing an order is an offer to buy. The order is accepted when we dispatch it, and we may decline one before then — if a flavour has sold out, a delivery address cannot be serviced, or a price was listed in error. If we decline an order you have paid for, you are refunded in full.",
        ],
      },
      {
        heading: "Pricing",
        body: [
          "All prices are in Indian Rupees and are inclusive of any taxes that apply. The price you see at checkout is the price you pay.",
          "Introductory pricing runs for a limited period and can end without notice. It does not change the price of an order already placed.",
        ],
      },
      {
        heading: "The product",
        body: [
          "MELTYK is a chocolate product. It contains milk and tree nuts, and is made in a kitchen that also handles other allergens. Each product page lists its ingredients and allergens in full, and it is your responsibility to read them before ordering or before giving a box to someone else.",
          "Store the box cool and dry, away from direct sunlight.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Our liability for any order is limited to the amount you paid for it. Nothing in these terms limits liability that cannot be limited under Indian law, including under the Consumer Protection Act, 2019.",
        ],
      },
      {
        heading: "Content",
        body: [
          "The photography, writing and design on this site belong to us. Please do not reuse them commercially without asking.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of India, and the courts at Bengaluru, Karnataka have exclusive jurisdiction over any dispute.",
        ],
      },
    ],
  },
];

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
