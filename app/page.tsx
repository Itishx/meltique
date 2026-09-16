import Link from "next/link";

import { faqs } from "@/lib/faq";
import { assortedBox, flavours, fromPriceInPaise } from "@/lib/products";
import { ProductWall } from "@/components/product/ProductWall";
import { GiftFormats } from "@/components/home/GiftFormats";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { StoryGrid } from "@/components/home/StoryGrid";

export default function HomePage() {

  return (
    <>
      {/* ------------------------------------------------------ 5.1 hero film
       * The whole section is the footage. No type over it — the wordmark is
       * already in the header, and the copy starts immediately below.
       */}
      {/* The footage is 16:9. A full-height hero on a portrait phone would crop
          it to a narrow vertical slice, so the hero is shorter on small screens
          and only fills the viewport once there is width to justify it. */}
      <section className="relative h-[64svh] w-full overflow-hidden bg-espresso sm:h-[78svh] lg:h-svh">
        <LoopingVideo
          src="/video/hero.mp4"
          poster="/images/editorial/hero.jpg"
          alt="A MELTYK box open on wrapped cubes in their four flavour colours"
          priority
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent"
        />
      </section>

      {/* ------------------------------------------------ 5.3 explore flavours */}
      <section className="bg-ivory text-ink-ivory" aria-labelledby="flavours">
        <div className="gutter pb-16 pt-24 md:pb-20 md:pt-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-4xl">
              <p className="label text-muted-ivory">01 · The flavours</p>
              <h2 id="flavours" className="display mt-4 text-display-lg text-balance">
                Four flavours everyone already loves.
              </h2>
              <p className="mt-5 max-w-[64ch] text-base text-muted-ivory">
                No obscure percentages, no acquired tastes. Meltyk Muse,
                Caramel Crunch, Fruit &amp; Nut and Protein, the four people
                actually reach for.
              </p>
            </div>
            <Link href="/flavours" className="label link-draw">
              Compare all four
            </Link>
          </Reveal>
        </div>

        {/* Full bleed and gutterless — the cells butt together as one sheet. */}
        <Reveal>
          <ProductWall products={flavours} tone="ivory" imageAspect="aspect-2/3" />
        </Reveal>
      </section>

      {/* ------------------------- 5.2 the cube · 5.4 box of 4 · 5.5 material
       * Held in one ruled grid rather than three full-bleed slabs.
       */}
      <StoryGrid boxOfFour={assortedBox} flavours={flavours} />

      {/* --------------------------------------------------------- 5.6 gifting */}
      {assortedBox ? (
        <section className="bg-paper" aria-labelledby="gifting">
          <div className="gutter pb-14 pt-14 md:pb-16 md:pt-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-4xl">
                <p className="label text-gold">04 · Your call</p>
                <h2 id="gifting" className="display mt-4 text-display-lg text-balance">
                  Four of one, or one of each.
                </h2>
                <p className="mt-5 max-w-[64ch] text-base text-muted">
                  The only decision we ask you to make. Four cubes of the
                  flavour they love, or one of every flavour when you are not
                  sure, which for a gift is usually the better answer.
                </p>
              </div>
              <Link href="/gifting" className="label link-draw">
                Gifting
              </Link>
            </Reveal>
          </div>

          {/* The two formats, not two flavours. */}
          <Reveal>
            <GiftFormats fromPriceInPaise={fromPriceInPaise} />
          </Reveal>
        </section>
      ) : null}

      {/* ------------------------------------------------------------- 5.8 faq */}
      <section className="bg-linen" aria-labelledby="faq">
        <div className="gutter py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-20">
            <Reveal>
              <p className="label text-gold">Questions</p>
              <h2 id="faq" className="display mt-4 text-display-lg">
                Before you order.
              </h2>
              <Link href="/faq" className="label link-draw mt-8 inline-block text-gold">
                All questions
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <FaqAccordion items={faqs.slice(0, 6)} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
