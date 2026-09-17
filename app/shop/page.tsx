import type { Metadata } from "next";
import Link from "next/link";

import { assortedBox, flavours, fromPriceInPaise } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { currentFromInPaise as currentFrom } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { Price } from "@/components/product/Price";
import { PreOrderButton } from "@/components/product/PreOrderButton";
import { ProductWall } from "@/components/product/ProductWall";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/site/Wordmark";

export const metadata: Metadata = {
  title: "Shop the Box of 4",
  description:
    "One format: a Box of 4. Four cubes of one flavour, or one of each. From ₹350.",
  alternates: { canonical: "/shop" },
};

const HOW = [
  {
    n: "01",
    title: "Pick a flavour",
    body: "Four cubes of Meltyk Muse, Caramel Crunch, Fruit & Nut or Protein.",
  },
  {
    n: "02",
    title: "Or take one of each",
    body: "The assorted box carries a single cube of every flavour.",
  },
  {
    n: "03",
    title: "Pre-order it",
    body: "Reserve ahead of the first run. Nothing is charged now.",
  },
];

export default function ShopPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero
       * Typographic rather than photographic: the boxes are directly below,
       * so the hero states the proposition and gets out of the way.
       */}
      <section className="gutter pb-16 pt-32 md:pb-20 md:pt-40">
        <Reveal>
          <p className="label text-gold">The range</p>
          <h1 className="display mt-6 max-w-[16ch] text-hero leading-[0.95]">
            One box. Four cubes.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 grid gap-x-16 gap-y-8 border-t border-rule pt-10 lg:grid-cols-[1.4fr_1fr]">
            <p className="text-lg leading-relaxed text-muted">
              <Wordmark size="sm" className="text-ink" /> is sold one way. Take
              four cubes of a single flavour, or the assorted box with one of
              each. Nothing larger, nothing smaller, and no decisions we can
              make for you.
            </p>

            <div className="flex flex-col gap-6">
              <p className="display text-display-sm tabular-nums">
                From {formatPrice(currentFrom ?? fromPriceInPaise)}
                <span className="label ml-3 align-middle text-muted">a box</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/pre-order"
                  className="label flex h-13 items-center bg-gold px-9 text-espresso transition-colors duration-300 hover:bg-on-dark"
                >
                  Get it now
                </Link>
                <Link href="/gifting" className="label link-draw">
                  Sending it as a gift
                </Link>
              </div>
              <p className="text-xs text-muted">{site.provisionalNote}</p>
            </div>
          </div>
        </Reveal>

        {/* A quiet index of what is below. */}
        <Reveal delay={200}>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8">
            {flavours.map((flavour) => (
              <li key={flavour.slug}>
                <Link
                  href={`/product/${flavour.slug}`}
                  className="label link-draw flex items-center gap-2.5 text-muted"
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                    style={{ backgroundColor: flavour.swatch }}
                  />
                  {flavour.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* -------------------------------------------------- the assorted box */}
      {assortedBox ? (
        <section aria-labelledby="assorted">
          <Reveal>
            <div className="grid border-y border-rule lg:grid-cols-[1.25fr_1fr]">
              <Link
                href={`/product/${assortedBox.slug}`}
                className="group relative block overflow-hidden bg-deep"
              >
                <div className="relative aspect-4/3">
                  <Media
                    src={assortedBox.images[0].src}
                    alt={assortedBox.images[0].alt}
                    sizes="(min-width: 64rem) 56vw, 100vw"
                    priority
                    quality={92}
                    className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="label absolute left-6 top-6 bg-paper px-3 py-1.5 text-ink">
                  Start here
                </span>
              </Link>

              <div className="flex flex-col justify-center border-t border-rule px-8 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-14">
                <h2 id="assorted" className="display text-display-lg leading-[1.05]">
                  {assortedBox.name}
                </h2>
                <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
                  {assortedBox.summary}
                </p>

                <dl className="mt-10 border-t border-rule pt-6">
                  <dt className="label text-muted">What is inside</dt>
                  <dd className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {flavours.map((flavour) => (
                      <span key={flavour.slug} className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                          style={{ backgroundColor: flavour.swatch }}
                        />
                        <span className="text-sm">{flavour.name}</span>
                      </span>
                    ))}
                  </dd>
                </dl>

                <p className="mt-8 flex items-baseline gap-4">
                  <Price product={assortedBox} size="lg" />
                  <span className="label text-muted">{assortedBox.weight}</span>
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:max-w-md">
                  <PreOrderButton product={assortedBox} size="lg" />
                  <Link
                    href={`/product/${assortedBox.slug}`}
                    className="label link-draw self-start text-gold"
                  >
                    See what is inside
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* -------------------------------------------------- single flavours */}
      <section aria-labelledby="flavour-boxes">
        <div className="gutter py-14 md:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 id="flavour-boxes" className="display text-display-lg">
                Or four of one.
              </h2>
              <p className="mt-4 max-w-[58ch] text-base text-muted">
                The same box, filled with a single flavour, for the person who
                already knows what they want.
              </p>
            </div>
            <Link href="/flavours" className="label link-draw">
              Compare the flavours
            </Link>
          </Reveal>
        </div>

        <Reveal>
          <ProductWall
            products={flavours}
            tone="dark"
            imageAspect="aspect-4/5"
            preferBoxImage
          />
        </Reveal>
      </section>

      {/* ----------------------------------------------------- how it works */}
      <section className="gutter py-20 md:py-28" aria-labelledby="how">
        <Reveal>
          <h2 id="how" className="display text-display-md">
            How it works.
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <ol className="mt-10 grid border border-rule md:grid-cols-3">
            {HOW.map((step, index) => (
              <li
                key={step.n}
                className={`flex flex-col px-8 py-10 sm:px-10 ${
                  index < HOW.length - 1
                    ? "border-b border-rule md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <span className="display text-5xl leading-none text-gold/80">
                  {step.n}
                </span>
                <h3 className="display mt-6 text-display-sm">{step.title}</h3>
                <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
                  {step.body}
                </p>

                {index === HOW.length - 1 ? (
                  <Link
                    href="/pre-order"
                    className="label mt-auto inline-flex h-12 w-fit items-center bg-gold px-8 pt-px text-espresso transition-colors duration-300 hover:bg-on-dark"
                  >
                    Get it now
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
    </>
  );
}
