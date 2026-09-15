import type { Metadata } from "next";
import Link from "next/link";

import { assortedBox, flavours } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";

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

      {/* -------------------------------------------------------- comparison
       * A real comparison rather than four essays. Subgrid keeps the rows
       * aligned across columns, so "Inside" reads straight across.
       */}
      <section aria-labelledby="compare">
        <h2 id="compare" className="sr-only">
          The flavours compared
        </h2>

        <div className="grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_auto_auto]">
          {flavours.map((product, index) => (
            <article
              key={product.slug}
              className="grid border-b border-rule sm:[&:nth-child(odd)]:border-r lg:row-span-5 lg:grid-rows-subgrid lg:border-r lg:last:border-r-0"
            >
              {/* Posters for all four, so the row reads as one set. */}
              <Link
                href={`/product/${product.slug}`}
                className="group relative block overflow-hidden"
                style={{ backgroundColor: product.poster?.ground ?? product.backdrop }}
              >
                <div className="relative aspect-2/3">
                  <Media
                    src={product.poster?.src ?? product.images[0].src}
                    alt={product.poster?.alt ?? product.images[0].alt}
                    sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
                    priority={index < 2}
                    quality={92}
                    className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="label absolute left-5 top-5 bg-paper px-3 py-1.5 text-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>

              <div className="px-6 pt-7 md:px-8">
                <h3 className="display text-[1.75rem] leading-[1.15] md:text-[2rem]">
                  <Link href={`/product/${product.slug}`} className="hover:opacity-70">
                    {product.name}
                  </Link>
                </h3>
                <p className="display mt-2 text-lg italic text-gold">
                  {product.tagline}
                </p>
              </div>

              <dl className="mt-6 px-6 md:px-8">
                <dt className="label text-muted">Inside</dt>
                <dd className="mt-2 text-sm leading-relaxed">{product.inside}</dd>
              </dl>

              <dl className="mt-5 px-6 md:px-8">
                <dt className="label text-muted">Notes</dt>
                <dd className="mt-2 text-sm leading-relaxed">
                  {product.sensoryNotes.join(" · ")}
                </dd>
              </dl>

              <div className="mt-6 px-6 pb-7 md:px-8">
                <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-5">
                  <span className="display text-2xl tabular-nums">
                    {formatPrice(product.priceInPaise)}
                  </span>
                  <span className="label text-muted">{product.weight}</span>
                </div>
                <Link
                  href={`/product/${product.slug}`}
                  className="label link-draw mt-5 inline-block text-gold"
                >
                  View this box
                </Link>
              </div>
            </article>
          ))}
        </div>
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
                <Link
                  href={`/product/${assortedBox.slug}`}
                  className="label mt-8 inline-flex h-13 w-fit items-center bg-gold px-9 text-espresso transition-colors duration-300 hover:bg-on-dark"
                >
                  The Assorted Box
                </Link>
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
