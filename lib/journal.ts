export interface Article {
  slug: string;
  title: string;
  category: "Craft" | "Flavour" | "Nutrition" | "Gifting" | "Ritual";
  excerpt: string;
  date: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  /** Body paragraphs; a string starting with "## " renders as a subheading. */
  body: string[];
  featured?: boolean;
}

export const articles: Article[] = [
  {
    slug: "the-cube",
    title: "Why a cube, and not a bar",
    category: "Craft",
    excerpt:
      "A bar is designed to be broken. A cube is designed to be finished. That single decision changed everything downstream.",
    date: "2026-09-02",
    readingMinutes: 5,
    featured: true,
    image: {
      src: "/images/journal/the-cube.jpg",
      alt: "A close view of a Meltyk cube with its embossed M and clean edges",
    },
    body: [
      "Every bar is a negotiation. You snap off two squares, mean to stop, and the open wrapper sits on the counter arguing with you for the rest of the evening.",
      "## The portion is the product",
      "A cube is a decision someone else already made. Twelve grams, wrapped, done, which is why the wrapper is sealed on all four sides rather than folded. There is no half-eaten state to manage.",
      "## Clean edges are harder than they look",
      "A cube has twelve edges and eight corners, and every one of them shows a temper fault. A bar hides its flaws in the mould pattern; a cube has nowhere to put them. We reject more than we would with a bar, and the mould is polished weekly rather than monthly.",
      "## The M is cast, not stamped",
      "The monogram is cut as a recess into the polycarbonate, so the letter is the chocolate itself rather than something applied to it. Hold a cube flat under a ceiling light and it nearly disappears. Tilt it toward a window and it declares itself.",
      "Same signature form. Clean edges. Rich textures. Real ingredients.",
    ],
  },
  {
    slug: "four-flavours",
    title: "Four flavours, four arguments",
    category: "Flavour",
    excerpt:
      "Meltyk Muse, Caramel, Fruit & Nut and Protein were not chosen to cover a spectrum. Each one answers a different question.",
    date: "2026-08-21",
    readingMinutes: 4,
    featured: true,
    image: {
      src: "/images/journal/four-flavours.jpg",
      alt: "The four Meltyk wrappers in black, copper, burgundy and ivory",
    },
    body: [
      "Most ranges are built as a gradient of 40%, 55%, 70%, 85%, which is honest but tells you nothing except how much sugar was removed.",
      "## Meltyk Muse: bold, pure, timeless",
      "The control. Seventy percent single origin, no centre, no inclusion. If this one is not right, nothing else in the range can be.",
      "## Caramel: smooth, buttery, addictive",
      "The indulgent one. Salted caramel that flows rather than sets, in a shell thin enough to give under light pressure.",
      "## Fruit & Nut: fruity, crunchy, indulgent",
      "The textural one. Whole almonds and dried cranberries placed rather than stirred, so every cube cuts the same way.",
      "## Protein: power in pleasure",
      "The useful one. Ten grams of protein that still tastes like chocolate rather than a supplement, the hardest of the four to get right, and the one that took longest.",
      "Four distinct flavours. Premium finish. Minimal and elegant. Consistent branding.",
    ],
  },
  {
    slug: "inside-the-cube",
    title: "Inside the cube",
    category: "Craft",
    excerpt:
      "What a cut cube reveals about how it was made, and why we photograph all four sliced open.",
    date: "2026-08-06",
    readingMinutes: 4,
    featured: true,
    image: {
      src: "/images/journal/inside.jpg",
      alt: "Four Meltyk cubes cut open to show dark chocolate, caramel, fruit and nut, and protein blend",
    },
    body: [
      "A whole cube tells you very little. A cut one tells you almost everything: whether the caramel was cooked far enough, whether the almonds were placed or stirred, whether the shell is even.",
      "## Intense dark chocolate",
      "The Meltyk Muse cuts to a matte, dense face with no air. Any bubble means the mould was filled too fast.",
      "## Flowing caramel centre",
      "The caramel should slump slightly at the cut and then stop. If it runs, it was under-cooked; if it holds a sharp edge, it was over.",
      "## Real fruits and crunchy nuts",
      "You should be able to count the almonds. Chopped inclusions are cheaper and cut more cleanly, and they turn the cube into a texture rather than an ingredient.",
      "## Nutrient-rich blend",
      "The protein cube is the densest of the four, and the only one where the cut face is meant to look packed rather than smooth.",
    ],
  },
  {
    slug: "protein-without-apology",
    title: "Protein chocolate, without the apology",
    category: "Nutrition",
    excerpt:
      "Ten grams of protein in twelve grams of pleasure. The hard part was refusing to make it taste healthy.",
    date: "2026-07-15",
    readingMinutes: 5,
    image: {
      src: "/images/journal/protein.jpg",
      alt: "A Meltyk Protein cube packed with nuts and seeds beside its ivory wrapper",
    },
    body: [
      "Protein confectionery usually announces itself. There is a chalkiness, a certain drying finish, and a flavour that reads as compensation.",
      "## Protein is a texture problem",
      "Whey on its own goes gritty in chocolate and pulls water out of the fat phase. Blending it with pea protein and grinding finer than we would for cocoa solids fixes most of it; the rest is fat, which is why this cube carries more cocoa butter than the others.",
      "## Sweetness had to come down, not up",
      "The instinct is to add sugar to cover the protein. It makes it worse: you get sweet chalk. We took sugar out and let roasted almonds and pumpkin seeds do the work instead.",
      "## Why it is bigger",
      "Eighteen grams rather than twelve. Ten grams of protein will not fit in a twelve-gram cube without becoming a supplement, and we would rather change the dimensions than change what it is.",
      "More than chocolate. A better you.",
    ],
  },
  {
    slug: "gifting-guide",
    title: "A short guide to giving chocolate well",
    category: "Gifting",
    excerpt:
      "Format matters more than size, the tag matters more than the ribbon, and nobody has wanted a bigger box than the room could finish.",
    date: "2026-06-24",
    readingMinutes: 4,
    image: {
      src: "/images/journal/gifting.jpg",
      alt: "A Meltyk box tied with satin ribbon and a foil-blocked hang tag",
    },
    body: [
      "Most gift chocolate fails in one of two ways: it is too large to finish, or too anonymous to remember. Both are format problems rather than flavour problems.",
      "## Match the size to the room",
      "One person: the tube, or six cubes. Two: ten. A table of six or more: twenty, opened early in the evening rather than late.",
      "## Write the tag first",
      "Choose what you want to say, then choose the box. A short, specific line on a foil-blocked tag outlasts the chocolate by years. It is the part people keep.",
      "## Ship it cool",
      "Between April and September, ask for the insulated pack. Chocolate that has bloomed is perfectly good to eat and looks like it has been in a cupboard since last year.",
      "## Don't over-wrap",
      "If the box already carries a ribbon and a tag, adding paper over the top hides the thing you paid for. Hand it over as it comes.",
    ],
  },
  {
    slug: "bean-to-bar",
    title: "Bean to bar, and what that commits you to",
    category: "Craft",
    excerpt:
      "The phrase is on our box. Here is the inconvenient part of it.",
    date: "2026-05-30",
    readingMinutes: 5,
    image: {
      src: "/images/journal/bean-to-bar.jpg",
      alt: "The Meltyk Craft Chocolate Box with bronze light sweeping across its matte lid",
    },
    body: [
      "Bean to bar means we buy beans, not couverture. Everything between the sack and the wrapper happens in one room, which sounds romantic and is mostly logistics.",
      "## You inherit the harvest",
      "Buying couverture means buying a specification: the same chocolate, every year. Buying beans means the 2026 crop is drier than 2025 and the roast profile has to move to meet it.",
      "## Winnowing is the unglamorous part",
      "Cracking and separating husk from nib is noisy, dusty, and the single largest source of loss in the process. About twenty percent of the weight we buy never becomes chocolate.",
      "## Why we still do it",
      "Because fermentation and roast are where flavour is made, and buying finished couverture means letting someone else make those two decisions. That is the difference between a recipe and a house.",
    ],
  },
];

const bySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

export function sortedArticles(): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}
