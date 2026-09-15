import type { Metadata } from "next";
import Link from "next/link";

import { getByOccasion, occasions, products } from "@/lib/products";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { ProductWall } from "@/components/product/ProductWall";

export const metadata: Metadata = {
  title: "Gifts",
  description:
    "Wrapped, carded and closed before it reaches you. Meltyk gifting formats by occasion, with a hand-written message.",
  alternates: { canonical: "/gifts" },
};

const RITUAL = [
  { title: "Chosen", body: "Pick the format for the room: a bar for one, the drawer for two, the Signature Box for a table." },
  { title: "Written", body: "Add a message at checkout and it is written onto uncoated card by hand, not printed." },
  { title: "Closed", body: "Foil twisted at the bench, tissue folded, lid settled. It arrives ready to hand over." },
];

export default function GiftsPage() {
  const gifting = products;

  return (
    <>
      <section className="relative min-h-[78svh] overflow-hidden bg-espresso text-on-dark">
        <Media
          src="/images/editorial/gifting.jpg"
          alt="The Meltyk Gift Drawer open on hand-wrapped copper truffles"
          sizes="100vw"
          quality={92}
          priority
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/45 to-espresso/25"
        />
        <div className="gutter relative flex min-h-[78svh] flex-col justify-end pb-16 pt-36">
          <p className="label text-gold">Gifting</p>
          <h1 className="display mt-5 max-w-[22ch] text-display-xl">
            A moment, melted.
          </h1>
          <p className="mt-6 max-w-[62ch] text-base text-on-dark-muted">
            The last ten seconds before you hand it over should require nothing
            from you.
          </p>
        </div>
      </section>

      <section className="gutter py-20 md:py-28" aria-labelledby="ritual">
        <Reveal>
          <h2 id="ritual" className="display text-display-md">
            How it arrives
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-x-8 gap-y-10 border-t border-rule pt-10 md:grid-cols-3">
          {RITUAL.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 100}>
                <p className="label text-bronze-ink">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-3 text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-[56ch] text-sm text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="gutter pb-20 md:pb-28" aria-labelledby="gift-formats">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-10">
          <h2 id="gift-formats" className="display text-display-md">
            Gifting formats
          </h2>
          <Link href="/shop" className="label link-draw">
            All chocolate
          </Link>
        </Reveal>

      </section>

      <Reveal>
        <ProductWall products={gifting} tone="dark" imageAspect="aspect-2/3" columns={3} />
      </Reveal>

      <section className="gutter pb-24" aria-labelledby="occasion">
        <Reveal>
          <h2 id="occasion" className="display border-t border-rule pt-10 text-display-md">
            By occasion
          </h2>
        </Reveal>

        <div className="mt-12 space-y-16">
          {occasions.map((occasion) => {
            const list = getByOccasion(occasion).slice(0, 3);
            if (!list.length) return null;
            return (
              <div key={occasion}>
                <Reveal>
                  <h3 className="label text-bronze-ink">{occasion}</h3>
                </Reveal>
                <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                  {list.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="label link-draw flex items-center gap-2.5"
                      >
                        <span
                          aria-hidden
                          className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                          style={{ backgroundColor: product.swatch }}
                        />
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
