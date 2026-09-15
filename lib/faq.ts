import type { FaqItem } from "@/components/ui/FaqAccordion";

/**
 * The first six are the ones the homepage shows, so they answer the questions
 * a first-time visitor actually has. Anything not yet confirmed — nutrition,
 * shelf life, delivery — says so rather than being invented.
 */
export const faqs: FaqItem[] = [
  {
    question: "What exactly am I buying?",
    answer:
      "One thing: a Box of 4. Four chocolate cubes, each with an M pressed into the top face by the mould. You either take four cubes of a single flavour, or the assorted box with one of every flavour. There is nothing larger and nothing smaller.",
  },
  {
    question: "What are the four flavours?",
    answer:
      "Classic Dark, solid dark chocolate the whole way through. Caramel Crunch, a caramel centre with a crunch running through it. Fruit & Nut, packed edge to edge with whole nuts and dried fruit. And Protein, a crunchier cube built around nuts, seeds and puffed grains.",
  },
  {
    question: "Can I mix my own flavours in one box?",
    answer:
      "Not at the moment. A box is either four of one flavour or one of each. Those are the two options. Build-your-own is something we would like to offer once the first run is out.",
  },
  {
    question: "Why only a box of four?",
    answer:
      "Because we would rather make one format properly than five adequately. Every flavour is the same shape and the same size, so it followed that every box should hold the same count. Four is enough to share and small enough to hand over without ceremony.",
  },
  {
    question: "What does a box cost?",
    answer:
      "From ₹350, depending on the flavour. The heavier cubes cost a little more. Pricing is indicative until pre-orders are confirmed, and you will see the final figure before anything is charged.",
  },
  {
    question: "What does pre-ordering actually do?",
    answer:
      "It reserves a box from the first run and tells us how much to make. Nothing is charged when you pre-order. We come back to you with the final price and a dispatch date, and you confirm from there.",
  },
  {
    question: "Is it a good thing to give as a gift?",
    answer:
      "That is what it was built for. The box is the product rather than the wrapper, so it arrives ready to hand over. If you are buying for someone else and do not know what they like, the assorted box is the safer answer. It lets them find their own favourite.",
  },
  {
    question: "What is in them, and what are the allergens?",
    answer:
      "Every product page carries its full ingredient list and allergen statement. All four flavours are made in the same kitchen, so cross-contact with milk, tree nuts, soy and gluten is possible even in the flavours that do not list them.",
  },
  {
    question: "Do you publish nutrition information?",
    answer:
      "Not yet. Nutrition panels go up once the final recipes have been lab-tested. We would rather leave the panel blank than estimate it and be wrong.",
  },
  {
    question: "How should I store them?",
    answer:
      "Cool, dry and out of direct sunlight. Chocolate that has warmed and reset may bloom, which leaves a pale film on the surface: still perfectly good to eat, it has just lost its finish. Shelf life is to be confirmed.",
  },
  {
    question: "When and where do you deliver?",
    answer:
      "Delivery areas, charges and timings are being finalised. They will be confirmed with your pre-order before anything is dispatched or paid for.",
  },
  {
    question: "Who is behind MELTYK?",
    answer:
      "A small team who have always loved chocolate, building this as Storm One at MESA School of Business. It is the first thing we have made properly, and the whole point was chocolate we would actually want to give someone.",
  },
];
