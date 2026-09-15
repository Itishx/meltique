import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { Media } from "@/components/ui/Media";

/**
 * The two ways a box comes: assorted, or four of one flavour.
 *
 * These are formats rather than products — the individual box is whichever
 * flavour you choose, so it links to the shop instead of naming one.
 */
const FORMATS = [
  {
    kicker: "Assorted",
    title: "One of each.",
    line: "A cube of every flavour in a single box, the one to give when you do not know which they will love.",
    href: "/product/assorted",
    cta: "View the assorted box",
    src: "/images/editorial/assorted-box-tray.jpg",
    alt: "The MELTYK assorted box open beside its lid, one cube of each flavour in a fitted tray",
  },
  {
    kicker: "Individual",
    title: "Four of one.",
    line: "Four cubes of the flavour you pick. For the person who already knows exactly what they want.",
    href: "/shop",
    cta: "Choose a flavour",
    src: "/images/products/box-of-4/1.jpg",
    alt: "A MELTYK box of four matching cubes, open on stone beside its lid",
  },
];

export function GiftFormats({ fromPriceInPaise }: { fromPriceInPaise: number }) {
  return (
    <div className="grid grid-cols-1 border-t border-rule sm:grid-cols-2">
      {FORMATS.map((format, index) => (
        <article
          key={format.kicker}
          className={`flex flex-col border-b border-rule ${
            index === 0 ? "sm:border-r" : ""
          }`}
        >
          <Link href={format.href} className="group relative block overflow-hidden">
            {/* 4:3 frame for a 4:3 photograph — nothing is cropped. */}
            <div className="relative aspect-4/3 bg-deep">
              <Media
                src={format.src}
                alt={format.alt}
                sizes="(min-width: 640px) 50vw, 100vw"
                quality={92}
                className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
              />
            </div>
            <span className="label absolute left-5 top-5 bg-paper px-3 py-1.5 text-ink">
              {format.kicker}
            </span>
          </Link>

          <div className="flex flex-1 flex-col px-6 pb-7 pt-7 md:px-8">
            <h3 className="display text-[1.75rem] leading-[1.15] md:text-[2rem]">
              <Link href={format.href} className="hover:opacity-70">
                {format.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-[54ch] text-sm text-muted">{format.line}</p>

            <div className="mt-auto flex items-center justify-between gap-6 border-t border-rule pt-6 md:mt-8">
              <p className="display text-2xl tabular-nums">
                From {formatPrice(fromPriceInPaise)}
              </p>
              <Link href={format.href} className="label link-draw text-gold">
                {format.cta}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
