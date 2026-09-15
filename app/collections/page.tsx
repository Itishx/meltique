import type { Metadata } from "next";
import Link from "next/link";

import { collections } from "@/lib/collections";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Four curated ways into the house: Discovery, Tasting, Celebration and Gifting.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="gutter">
        <Reveal>
          <p className="label text-bronze-ink">Curated</p>
          <h1 className="display mt-5 max-w-[24ch] text-display-xl">
            Four ways to begin.
          </h1>
          <p className="mt-6 max-w-[68ch] text-sm text-muted">
            Each collection is sequenced rather than assembled, a route through
            the range with its own pace and its own reason.
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 space-y-px">
        {collections.map((collection, index) => (
          <li key={collection.slug}>
            <Reveal>
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block overflow-hidden bg-cocoa"
              >
                <div className="relative aspect-4/5 sm:aspect-16/9 lg:aspect-21/9">
                  <Media
                    src={collection.image.src}
                    alt={collection.image.alt}
                    sizes="100vw"
                    priority={index === 0}
                    className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-espresso/10"
                  />
                </div>

                <div className="gutter absolute inset-x-0 bottom-0 pb-10 text-on-dark md:pb-14">
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <p className="label text-gold">
                        {String(collection.order).padStart(2, "0")} · {collection.kicker}
                      </p>
                      <h2 className="display mt-3 text-display-lg">{collection.name}</h2>
                      <p className="mt-3 max-w-[62ch] text-sm text-on-dark-muted">
                        {collection.intro}
                      </p>
                    </div>
                    <span className="label border-b border-current pb-1">
                      View collection
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
