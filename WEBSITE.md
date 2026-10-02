# MELTYK — the website, end to end

A reference for what this site is, how it is built, what is real and what is
still placeholder. Written from the code as it stands on `main` (commit
`486deff`, 20 September 2026).

---

## 1. What the business is

**MELTYK** (spelled `Meltyk` in prose, `MELTYK` in the wordmark) is a luxury
D2C chocolate brand selling in India, in rupees.

- **Tagline:** *Made to melt.*
- **Promise:** *Chocolate made to be given.*
- **The product:** chocolate cubes with an **M** cast into the top face.
- **The format:** exactly one — a **Box of 4**. Either four cubes of a single
  flavour, or the **Assorted Box** with one of each. No singles, no larger packs.

The whole site is built around that single constraint. The FAQ, the home page,
the shop page and the story page all return to it: one format, four flavours,
one decision to make.

### The range (5 SKUs)

| Product | Slug | Shopify handle | List price | Weight |
|---|---|---|---|---|
| Meltyk Muse (dark) | `meltyk-muse` | `meltyk-muse-1` | ₹350 | 4 cubes · 48 g |
| Caramel Crunch | `caramel-crunch` | `crunchy-caramel` | ₹375 | 4 cubes · 48 g |
| Fruit & Nut | `fruit-nut` | `fruit-nut-1` | ₹395 | 4 cubes · 56 g |
| Protein | `protein` | `protein-chocolate` | ₹425 | 4 cubes · 48 g |
| The Assorted Box | `assorted` | `assorted-box` | ₹399 | 4 cubes · 52 g |

> "Meltyk Muse" was renamed from "Classic Dark" after launch. The old URL
> `/product/classic-dark` 301-redirects in [next.config.ts](next.config.ts).

### Live pricing

[lib/pricing.ts](lib/pricing.ts) overrides all of the above. While
`LAUNCH_PRICING_ACTIVE` is `true`, **every box sells at a flat ₹250**
(`LAUNCH_PRICE_IN_PAISE = 25000`) and the list price is shown struck through by
the [Price](components/product/Price.tsx) component. Flip one boolean to end the
offer and everything reverts to list.

Money is stored in **paise** everywhere and only becomes rupees in
[lib/format.ts](lib/format.ts) (`Intl.NumberFormat`, `en-IN`, INR, no decimals).

### Launch offers

Defined once in [lib/site.ts](lib/site.ts) under `offers`, because the same
numbers appear in four places — the announcement bar, the cart's delivery
meter, the Shopify discount, and the Shopify shipping rate:

- Promo code **`FIRSTMELT`**, 15% off the first run.
- **Free delivery over ₹999** (`freeDeliveryOverPaise: 99900`).

The file carries an explicit warning: the storefront cannot see shipping rules
until a cart has an address, so nothing here can verify itself. If Shopify has
no free tier at ₹999, the meter promises something checkout will not honour.
`scripts/shopify-shipping.mjs` exists to keep the two in sync.

---

## 2. The stack

| | |
|---|---|
| Framework | **Next.js 16.3.4**, App Router, React **19.2.8** |
| Language | TypeScript 5 (strict; `npm run typecheck` is clean) |
| Styling | **Tailwind CSS v4** via `@tailwindcss/postcss`, CSS-first `@theme` tokens |
| Fonts | Cormorant Garamond (display) + Inter (sans), via `next/font/google` |
| Images | `next/image` + a build-time `sharp` pipeline |
| Commerce | **Shopify, headless** (Storefront GraphQL API `2026-07`) |
| Hosting | **Vercel** — project `meltique`, deployed at `meltique.vercel.app` |
| Runtime deps | `next`, `react`, `react-dom`, `server-only`. That's it. |

There is no state library, no UI kit, no CMS, no analytics, no form backend.
Roughly **6,700 lines** of app/component/lib code.

### Commands

```bash
npm run dev              # next dev
npm run build            # next build
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm run imagery          # regenerate public/images from assets/source (needs sharp)
npm run shopify:check    # diagnose the Shopify connection, step by step
npm run shopify:sync     # push lib/products.ts into Shopify (--write to apply)
npm run shopify:discount # create/update the FIRSTMELT code
npm run shopify:shipping # align Shopify shipping rates with the site's promise
```

---

## 3. Routes

All rendered by the App Router. Everything is static except the checkout API.

| Route | File | What it is |
|---|---|---|
| `/` | [app/page.tsx](app/page.tsx) | Home |
| `/shop` | [app/shop/page.tsx](app/shop/page.tsx) | Shop the Box of 4 — assorted, then the four flavour boxes, then a "how it works" strip |
| `/flavours` | [app/flavours/page.tsx](app/flavours/page.tsx) | The four flavours, compared |
| `/gifting` | [app/gifting/page.tsx](app/gifting/page.tsx) | Gifting ritual (Chosen / Written / Closed), formats, by occasion |
| `/our-story` | [app/our-story/page.tsx](app/our-story/page.tsx) | Brand story, the two-box argument |
| `/product/[slug]` | [app/product/[slug]/page.tsx](app/product/[slug]/page.tsx) | PDP — 5 static params, Product JSON-LD |
| `/collections` and `/collections/[slug]` | [app/collections/](app/collections/) | Four editorial groupings |
| `/journal` and `/journal/[slug]` | [app/journal/](app/journal/) | Six long-form articles |
| `/faq` | [app/faq/page.tsx](app/faq/page.tsx) | 13 questions |
| `/policies/[slug]` | [app/policies/[slug]/page.tsx](app/policies/[slug]/page.tsx) | shipping · returns · privacy · terms |
| `/contact` | [app/contact/page.tsx](app/contact/page.tsx) | Contact form |
| `/pre-order` | [app/pre-order/page.tsx](app/pre-order/page.tsx) | Reserve a box (adds to cart) |
| `/cart` | [app/cart/page.tsx](app/cart/page.tsx) | Full cart view (`disallow`ed in robots.txt) |
| `/checkout` | [app/checkout/page.tsx](app/checkout/page.tsx) | Placeholder — real checkout is Shopify-hosted |
| `/api/checkout` | [app/api/checkout/route.ts](app/api/checkout/route.ts) | POST → Shopify checkout URL |
| 404 | [app/not-found.tsx](app/not-found.tsx) | |

`robots.ts` and `sitemap.ts` generate `/robots.txt` and `/sitemap.xml`.

### The home page, section by section

1. **Hero film** — `/video/hero.mp4`, looping, muted, autoplay, poster-backed.
   No type over it; the wordmark is already in the header. Shorter on phones
   (64svh) because the footage is 16:9 and a full-height portrait crop would
   be a narrow vertical slice.
2. **01 · The flavours** — four-up `ProductWall`, full-bleed and gutterless.
3. **StoryGrid** — the cube, the box of 4, and the material, held in one ruled
   grid rather than three full-bleed slabs.
4. **04 · Your call** — "Four of one, or one of each." The two *formats*, not
   two flavours.
5. **FAQ** — the first six questions.

---

## 4. Content model

All editorial content is typed TypeScript in `lib/`. No CMS, no markdown.

| File | Holds |
|---|---|
| [lib/products.ts](lib/products.ts) | The 5 products — story, tasting notes, ingredients, allergens, materials, imagery, occasions, related |
| [lib/types.ts](lib/types.ts) | `Product`, `Occasion`, `ProductImage` |
| [lib/collections.ts](lib/collections.ts) | The Four · Assorted · Gifting · Everyday |
| [lib/journal.ts](lib/journal.ts) | 6 articles, categorised Craft / Flavour / Nutrition / Gifting / Ritual |
| [lib/faq.ts](lib/faq.ts) | 13 Q&As — the first six are the homepage set |
| [lib/policies.ts](lib/policies.ts) | 4 policies, mostly `PENDING` placeholders |
| [lib/site.ts](lib/site.ts) | Brand strings, offers, header nav, footer nav |
| [lib/pricing.ts](lib/pricing.ts) | Launch price and the strike-through rule |

A `Product` carries a lot of art direction: `swatch` and `backdrop` (colours
sampled from the wrappers), `poster` with its own `ground` colour,
`insideImage` / `insideSquare` (the cube broken open), `boxImage`.

**Nutrition is deliberately empty** and several policy sections say "to be
confirmed" rather than inventing numbers. That is a stated editorial rule in
the FAQ file, not an oversight.

---

## 5. Design system

Tokens live in [app/globals.css](app/globals.css) under Tailwind v4's `@theme`.

**The house runs dark.** Chocolate is the ground, cream is the ink, gold is the
foil. `paper` (`#241711`) is the page surface, `linen` (`#2f1f17`) the lifted
band — both browns, so a section only needs a class when it wants to go deeper.
`ivory` (`#f4efe7`) is the breathing space, and the whole text palette flips
(`ink-ivory`, `muted-ivory`, `rule-ivory`) in those sections.

Flavour identities are sampled from the wrappers: dark `#1c1917`, caramel
`#a35939`, fruit `#662628`, protein `#d0c1b5`.

Custom utilities: `label` (uppercase, 0.24em tracking, one point *larger* on
phones because it's read at arm's length), `display`, `wordmark`, `gutter`
(responsive page padding at 4 breakpoints), `rule`, `link-draw` (an underline
that draws itself from the left), `shimmer` (a foil sweep clipped to the
logotype's glyphs, with a hold between sweeps).

### Accessibility and motion, handled properly

- **Skip link**, focus-visible outlines on everything interactive.
- **Touch targets:** the small editorial labels get a transparent `::before`
  that grows the hit area to ~44px *without occupying layout space*, so the
  tight typographic rhythm survives. Coarse pointers only.
- **`prefers-reduced-motion`** is honoured in four separate places — reveals,
  the shimmer, the nav sheet, and a global animation kill-switch.
- **`.no-js`** is stripped by an inline script before paint, so reveal states
  can't stick if JS fails.
- The cart drawer traps focus, restores it to the trigger on close, and closes
  on Escape or scrim click.
- Struck prices use a real `<s>` plus an `sr-only` "reduced from X to Y".

---

## 6. Imagery

`assets/source/` holds ~22 large source PNGs from the brand shoot (~25 MB,
`.vercelignore`d — build inputs only). [scripts/prepare-imagery.mjs](scripts/prepare-imagery.mjs)
crops, letterboxes and resizes them into `public/images/` at fixed aspect
presets (card 1:1, wide 16:9, ultra 8:3, band, landscape 3:2, box 4:3), and
writes [lib/generated/image-manifest.json](lib/generated/image-manifest.json)
with each file's dimensions and a base64 **blur LQIP**.

Two of the sources are brand *sheets*, whose panels are cut out by hand-measured
boxes. Panels that are natively landscape get letterboxed onto their own sampled
backdrop rather than cropped square, so the product is never cut.

[components/ui/Media.tsx](components/ui/Media.tsx) reads that manifest, so every
frame reserves its own space and fades in from a tonal placeholder. `next.config.ts`
serves only three deliberate qualities (70 / 82 / 92) in AVIF and WebP.

Supporting primitives: `LoopingVideo`, `ParallaxMedia`, `Reveal` (CSS-driven,
IntersectionObserver-triggered, fires once).

---

## 7. The cart

[lib/cart-store.ts](lib/cart-store.ts) + [lib/cart.tsx](lib/cart.tsx).

The cart lives **outside React**, in `localStorage` under `meltyk.cart.v1`,
exposed through `useSyncExternalStore`. Modelling it as an external store rather
than effect-synchronised state means:

- the snapshot is correct on the **first client render** (no flash of empty cart),
- a change in one tab reaches every other tab via the `storage` event,
- blocked storage (private browsing) degrades to an empty cart instead of throwing.

Only the drawer's open/closed state is React's to own. Max 12 per line. A
`useHydrated()` hook holds cart-dependent UI steady for the one frame before the
real snapshot lands, without an effect.

---

## 8. Shopify — headless

Documented at length in [SHOPIFY.md](SHOPIFY.md). The short version:

### The split

| | Owner |
|---|---|
| Story, tagline, sensory notes, ingredients, photography | `lib/products.ts` |
| Price, stock, variant IDs, orders, checkout | **Shopify** |

Joined on **handle**. Note the wrinkle: the catalogue in Shopify is pushed by a
**Mesa POS**, which names its own handles, so the mapping lives in
`product.shopifyHandle` rather than renaming things in Shopify (a rename would
only survive until the next POS sync). The durable place to change a price is
therefore the POS, not Shopify and not the code.

### Why headless, not a theme

A Shopify theme runs Liquid only — no Node, no React, no Next.js build.
Converting would be a rewrite of every file, keeping only the CSS and images.
(`npm init @shopify/app` is a third, unrelated thing: an embedded *admin* app.)

### Checkout flow

1. Shopper clicks **Proceed to checkout** in [CartView](components/site/CartView.tsx)
2. [lib/checkout.ts](lib/checkout.ts) POSTs `{slug, quantity}[]` to `/api/checkout`
3. [the route](app/api/checkout/route.ts) resolves each slug to a **live variant
   ID server-side**, creates a Shopify cart, returns its `checkoutUrl`
4. The browser follows it to Shopify's hosted checkout

Variant IDs are never stored in the browser cart. A cart saved last week — or
saved before the store existed at all — still checks out, and re-creating a
variant in the admin doesn't strand anyone's basket.

### Graceful degradation is the design

With no token set, `isShopifyConfigured` is false, every Shopify call
short-circuits, and the site runs in **pre-order mode**. This is treated as a
normal state, not an error:

- `/api/checkout` answers **503 `not_configured`**, and the client routes to
  pre-order rather than showing an error.
- Empty catalogue → **503 `empty_catalogue`**. Everything sold out → **409**.
  Both also route to pre-order.
- `getCommerce()` **never throws** — a Shopify outage resolves to an empty map
  and the site falls back to local prices.
- Shopper-facing messages say what the shopper can do, never what the store is
  missing. (Commit `382c5db` exists specifically because one error string was
  leaking an operator instruction to customers.)

### Security posture

Tokens are **server-only** (`import "server-only"` at the top of `client.ts`
and `catalogue.ts`). No Shopify token ever reaches the browser. The Admin token
(`shpat_…`, scopes `write_products` / `read_products`) is read by the sync
script alone and is deliberately kept **out of Vercel**. Buyer IP is forwarded
to Shopify so rate limiting is per-shopper, not per-Vercel-instance. The API
version is pinned to `2026-07` — a deliberate annual bump rather than a float.

### Env

```
SHOPIFY_STORE_DOMAIN=5pxmtf-ni.myshopify.com   # not secret
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=...           # site; Vercel
SHOPIFY_STOREFRONT_PUBLIC_TOKEN=...            # fallback
SHOPIFY_ADMIN_TOKEN=shpat_...                  # scripts only; NOT Vercel
SHOPIFY_PUBLIC_ORIGIN=https://meltique.vercel.app
NEXT_PUBLIC_SITE_URL=                          # defaults to https://meltyk.com
```

---

## 9. SEO

- Metadata template `%s · Meltyk`, `metadataBase` from `site.url`.
- OpenGraph + Twitter summary_large_image, `/images/og.jpg` (1200×630).
- Per-product `generateMetadata` with canonical URLs and OG images.
- **Product JSON-LD** on every PDP, carrying price and availability.
- `robots.txt` allows everything except `/cart`; `sitemap.xml` covers statics,
  all products, all collections, all articles.
- Theme colour `#241711`, `colorScheme: dark`.

---

## 10. Known gaps and loose ends

Things a reader should know are not finished. None of them break the build
(`tsc --noEmit` passes clean).

1. **`sitemap.ts` lists two routes that do not exist** — `/gifts` and
   `/our-craft`. The real routes are `/gifting` and `/our-story`. Google is
   being handed two 404s.
2. **`Chrome.tsx` guards the same dead routes.** `OVERLAY_ROUTES = ["/our-craft", "/gifts"]`
   never matches, so the transparent-header behaviour is effectively dead code
   outside `/collections/*`.
3. **Three unused components**: `Newsletter.tsx`, `ShopFilters.tsx`,
   `QuickAdd.tsx` are not imported anywhere. `Newsletter` also points at
   `/images/editorial/newsletter.jpg`, which does not exist.
4. **Policies are placeholders.** Shipping, returns, privacy and terms are
   mostly `PENDING` — real legal copy is needed before taking real money.
5. **Nutrition is empty** and shelf life says "to be confirmed", by choice,
   until lab values exist.
6. **The contact form has no backend.** (The pre-order form used to have the
   same problem and was replaced in commit `57c9afd` — it collected name, email,
   city and a box and discarded all of it. The contact form still does.)
7. **Two things gate real orders, neither is code**: the Shopify store is
   password-protected (trial default, remove under Online Store → Preferences),
   and taking real payments needs a paid plan.
8. **The free-delivery threshold is unverifiable from the storefront.** If the
   Shopify shipping rule doesn't match `offers.freeDeliveryOverPaise`, the
   meter lies. Run `npm run shopify:shipping`.

---

## 11. Repo map

```
app/                      routes (App Router)
  api/checkout/route.ts   cart -> Shopify checkout URL
  globals.css             design tokens + utilities (353 lines)
  layout.tsx              fonts, metadata, CartProvider, Chrome/Footer/CartDrawer
components/
  site/                   Header, Chrome, AnnouncementBar, Footer, Wordmark,
                          CartDrawer, CartView, DeliveryMeter, PreOrderPicker,
                          ContactForm, CheckoutPlaceholder, Newsletter*
  product/                ProductDetail, ProductWall, BuyPanel, Price,
                          QuantityStepper, PreOrderButton, ShopFilters*, QuickAdd*
  home/                   StoryGrid, GiftFormats
  flavours/               FlavourRail
  ui/                     Media, LoopingVideo, ParallaxMedia, Reveal, FaqAccordion
lib/
  products / collections / journal / faq / policies / site / pricing / types
  cart-store.ts, cart.tsx, checkout.ts, format.ts, image.ts, clsx.ts
  shopify/                config, client, queries, types, cart, catalogue
  generated/              image-manifest.json (built)
scripts/                  prepare-imagery, shopify-check, -sync, -discount, -shipping
assets/source/            shoot originals (~25 MB, not deployed)
public/images/            generated library
public/video/hero.mp4     home hero footage

* = currently unused
```

---

## 12. The one thing to understand

Every notable decision in this codebase comes from the same place: **the site
must stay truthful and must stay up.**

That is why the cart lives outside React (correct on first paint), why variant
IDs resolve server-side (old carts still work), why Shopify failures route to
pre-order instead of an error page (a state of the business, not a fault), why
nutrition is blank rather than invented, why the price strikes through instead
of the catalogue quietly being rewritten, and why the free-delivery meter file
carries a warning that it cannot verify its own promise.

Read the comments. They are unusually good and they explain the *why*, not the
what.
