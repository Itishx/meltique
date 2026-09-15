import type { Metadata } from "next";
import Link from "next/link";

import { assortedBox, flavours } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { FlavourRail } from "@/components/flavours/FlavourRail";
import { PreOrderButton } from "@/components/product/PreOrderButton";

export const metadata: Metadata = {
  title: "The four flavours",
  description:
    "Classic Dark, Caramel Crunch, Fruit & Nut and Protein. One signature cube, four distinct flavours, side by side.",
  alternates: { canonical: "/flavours" },
};

export default function FlavoursPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="gutter pb-14 pt-32 md:pb-16 md:pt-40">
        <Reveal>
          <p className="label text-gold">The four</p>
          <h1 className="display mt-6 max-w-[22ch] text-hero leading-[0.95]">
            Four flavours, side by side.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-10 max-w-[70ch] border-t border-rule pt-10 text-lg leading-relaxed text-muted">
            The same cube and the same clean edges, with four entirely different
            arguments about what a piece of chocolate should do. Every one is
            sold the same way: four to a box.
          </p>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- the rail
       * Pinned on a wide screen: the page scrolls down, the cards travel in
       * from the right. Bigger frames than a four-up grid allows, and they
       * arrive one at a time rather than all at once.
       */}
      <section aria-labelledby="compare">
        <h2 id="compare" className="sr-only">
          The flavours compared
        </h2>
        <FlavourRail products={flavours} />
      </section>

      {/* -------------------------------------------------- inside the cube */}
      <section className="gutter py-20 md:py-28" aria-labelledby="inside">
        <Reveal className="max-w-3xl">
          <p className="label text-gold">The difference</p>
          <h2 id="inside" className="display mt-5 text-display-lg">
            It shows in the break.
          </h2>
          <p className="mt-5 max-w-[66ch] text-base text-muted">
            The wrapper tells you the flavour. Breaking one open tells you what
            it actually is.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {flavours.map((product, index) => (
            <li key={product.slug}>
              <Reveal delay={index * 80}>
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-deep">
                    <Media
                      src={product.insideSquare?.src ?? product.images[0].src}
                      alt={product.insideSquare?.alt ?? product.images[0].alt}
                      sizes="(min-width: 64rem) 23vw, (min-width: 40rem) 46vw, 92vw"
                      className="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-105"
                    />
                  </div>
                  <p className="label mt-5 flex items-center gap-2.5 text-gold">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                      style={{ backgroundColor: product.swatch }}
                    />
                    {product.name}
                  </p>
                  <p className="mt-2 text-sm text-muted">{product.inside}</p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- or all four */}
      {assortedBox ? (
        <section aria-labelledby="all-four">
          <Reveal>
            <div className="grid border-y border-rule lg:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-14 sm:px-10 lg:px-14">
                <p className="label text-gold">Cannot decide</p>
                <h2 id="all-four" className="display mt-5 text-display-lg leading-[1.05]">
                  Then take all four.
                </h2>
                <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
                  {assortedBox.summary} It is the box most people give away
                  rather than keep.
                </p>
                <p className="mt-8 flex items-baseline gap-4">
                  <span className="display text-3xl tabular-nums">
                    {formatPrice(assortedBox.priceInPaise)}
                  </span>
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

              <Link
                href={`/product/${assortedBox.slug}`}
                className="group relative order-first block overflow-hidden bg-deep lg:order-last lg:border-l lg:border-rule"
              >
                <div className="relative aspect-4/3">
                  <Media
                    src={assortedBox.images[0].src}
                    alt={assortedBox.images[0].alt}
                    sizes="(min-width: 64rem) 50vw, 100vw"
                    quality={92}
                    className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </div>
          </Reveal>
        </section>
      ) : null}
    </>
  );
}
