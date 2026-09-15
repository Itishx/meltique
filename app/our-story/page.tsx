import type { Metadata } from "next";
import Link from "next/link";

import { flavours } from "@/lib/products";
import { site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/site/Wordmark";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "MELTYK started at MESA School of Business, built by people who have always loved chocolate. One box, four flavours, made to be given.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  return (
    <>
      {/* ------------------------------------------------------------ opening */}
      <section className="gutter pb-16 pt-32 text-center md:pt-40">
        <Reveal>
          <p className="label text-gold">Our story</p>
          <h1 className="display mx-auto mt-6 max-w-[28ch] text-display-xl text-balance">
            We just really liked chocolate.
          </h1>
          <p className="mx-auto mt-7 max-w-[70ch] text-base text-balance text-muted">
            That is the whole beginning of it. No family recipe, no generations
            of chocolatiers, just people who have always been the biggest
            chocolate lovers you could imagine.
          </p>
        </Reveal>
      </section>

      <Reveal variant="image">
        <ParallaxMedia
          src="/images/editorial/made-to-melt.jpg"
          alt="All four MELTYK cubes melting together, each embossed with an M and spilling its own filling"
          sizes="100vw"
          quality={92}
          strength={7}
          className="aspect-16/9 w-full bg-deep sm:aspect-21/9"
        />
      </Reveal>

      {/* --------------------------------------------------------- the story */}
      <section className="gutter py-20 md:py-28">
        <div className="mx-auto max-w-[74ch]">
          <Reveal>
            <p className="display text-display-sm leading-relaxed">
              Then we got into MESA School of Business, where the brief was to
              build a real business of our own.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 space-y-6 text-base leading-[1.85]">
            <p>
              Ours became Storm One, and we decided to build the thing we
              actually cared about: a direct-to-consumer chocolate brand. What
              you are looking at is the result.
            </p>
            <p>
              We have put a genuine amount of heart and effort into it, the way
              anyone does with the first thing they build properly. We wanted
              chocolate that melts in your mouth, that makes you want to come
              back for the second cube, and that reminds you why chocolate
              exists in the first place.
            </p>
            <p>
              That is the whole ambition. Not to reinvent chocolate, just to
              make it well enough that handing someone a box means something.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ made to give */}
      <section className="bg-ivory text-ink-ivory" aria-labelledby="gifting">
        <div className="gutter grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal variant="image" className="relative aspect-4/3 overflow-hidden bg-linen">
            <Media
              src="/images/products/assorted-box/1.jpg"
              alt="The MELTYK assorted Box of 4 open beside its lid, one cube of each flavour in a fitted tray"
              sizes="(min-width: 64rem) 48vw, 92vw"
              quality={92}
              className="size-full object-cover"
            />
          </Reveal>

          <Reveal>
            <p className="label text-muted-ivory">Why a box</p>
            <h2 id="gifting" className="display mt-5 text-display-lg text-balance">
              Made to be given.
            </h2>
            <p className="mt-6 max-w-[60ch] text-base text-muted-ivory">
              <Wordmark size="sm" className="text-ink-ivory" /> was built around
              giving. A cube is small enough to hand over without ceremony and
              good enough that it lands, the kind of thing you bring for
              someone you love, or someone you want to.
            </p>
            <p className="mt-4 max-w-[60ch] text-base text-muted-ivory">
              Which is why the box is the product, not the wrapper.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- two boxes */}
      <section className="gutter py-20 md:py-28" aria-labelledby="two-boxes">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="label text-gold">The range</p>
          <h2 id="two-boxes" className="display mt-5 text-display-lg">
            Two boxes. That is all.
          </h2>
          <p className="mt-6 text-base text-balance text-muted">
            We make one format: a Box of 4. You either take four cubes of a
            single flavour, or the assorted box with one of each. We would
            rather make one thing properly than five things adequately.
          </p>
        </Reveal>

        <div className="mt-14 grid border border-rule sm:grid-cols-2">
          <Reveal>
            <div className="h-full px-8 py-10 sm:px-10">
              <p className="label text-gold">Individual</p>
              <h3 className="display mt-4 text-display-sm">Four of one flavour.</h3>
              <p className="mt-4 max-w-[52ch] text-sm text-muted">
                For the person who already knows what they like. Classic Dark,
                Caramel Crunch, Fruit &amp; Nut or Protein.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                {flavours.map((flavour) => (
                  <li key={flavour.slug} className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                      style={{ backgroundColor: flavour.swatch }}
                    />
                    <span className="label text-muted">{flavour.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90} className="border-t border-rule sm:border-l sm:border-t-0">
            <div className="h-full px-8 py-10 sm:px-10">
              <p className="label text-gold">Assorted</p>
              <h3 className="display mt-4 text-display-sm">One of each.</h3>
              <p className="mt-4 max-w-[52ch] text-sm text-muted">
                For everyone else, and for gifting, where letting someone
                choose their own favourite is half the pleasure.
              </p>
              <Link
                href="/product/assorted"
                className="label link-draw mt-6 inline-block text-gold"
              >
                View the assorted box
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14 text-center">
          <Link
            href="/pre-order"
            className="label inline-flex h-13 items-center bg-gold px-10 text-espresso transition-colors duration-300 hover:bg-on-dark"
          >
            Pre-order a box
          </Link>
          <p className="mt-4 text-xs text-muted">{site.preOrderNote}</p>
        </Reveal>
      </section>
    </>
  );
}
