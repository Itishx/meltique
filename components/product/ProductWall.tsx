import Link from "next/link";

import { clsx } from "@/lib/clsx";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Media } from "@/components/ui/Media";
import { QuickAdd } from "./QuickAdd";

/**
 * A knitted product wall.
 *
 * No gutters — cells sit directly against each other and are separated by
 * hairlines, so the grid reads as one continuous sheet. Each cell is a picture
 * with its name, descriptor and price stacked beneath it.
 */
export function ProductWall({
  products,
  tone = "ivory",
  columns = 2,
  imageAspect = "aspect-2/3",
  preferBoxImage = false,
}: {
  products: Product[];
  /** `ivory` for the off-white sections, `dark` for the chocolate ground. */
  tone?: "ivory" | "dark";
  columns?: 2 | 3;
  /** Must match the source ratio, so nothing is cropped away. */
  imageAspect?: string;
  /** Show each flavour's box of four rather than its poster. */
  preferBoxImage?: boolean;
}) {
  const ivory = tone === "ivory";
  const rule = ivory ? "border-rule-ivory" : "border-rule";
  const chip = ivory ? "bg-ivory text-ink-ivory" : "bg-paper text-ink";
  const muted = ivory ? "text-muted-ivory" : "text-muted";

  return (
    <div
      className={clsx(
        "grid grid-cols-1 border-t",
        rule,
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {products.map((product, index) => (
        <article
          key={product.slug}
          className={clsx(
            "flex flex-col border-b",
            rule,
            /* Vertical hairlines between columns, never on the outer edge. */
            columns === 3
              ? "lg:[&:not(:nth-child(3n))]:border-r sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r"
              : "sm:[&:nth-child(odd)]:border-r",
          )}
        >
          <Link
            href={`/product/${product.slug}`}
            className="group relative block overflow-hidden"
            style={{
              backgroundColor: preferBoxImage
                ? product.backdrop
                : (product.poster?.ground ?? product.backdrop),
            }}
          >
            {/* The frame matches the photograph's own ratio — cover then has
                nothing to trim, so the full image is always shown. */}
            <div className={clsx("relative", imageAspect)}>
              <Media
                src={
                  (preferBoxImage && product.boxImage?.src) ||
                  product.poster?.src ||
                  product.images[0].src
                }
                alt={
                  (preferBoxImage && product.boxImage?.alt) ||
                  product.poster?.alt ||
                  product.images[0].alt
                }
                sizes={columns === 3 ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                priority={index < 2}
                quality={92}
                className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
              />
            </div>

            {/* House tag, set into the corner like a stamp. */}
            <span className={clsx("label absolute left-5 top-5 px-3 py-1.5", chip)}>
              {product.weight}
            </span>
          </Link>

          <div className="flex flex-1 flex-col px-6 pb-7 pt-7 md:px-8">
            <h3 className="display text-[1.75rem] leading-[1.15] md:text-[2rem]">
              <Link href={`/product/${product.slug}`} className="hover:opacity-70">
                {product.name}
              </Link>
            </h3>
            <p className={clsx("label mt-3", muted)}>
              {product.inside ?? product.summary}
            </p>

            <div className={clsx("mt-auto flex items-center justify-between gap-6 border-t pt-6 md:mt-8", rule)}>
              <p className="display text-2xl tabular-nums">
                {formatPrice(product.priceInPaise)}
              </p>
              <QuickAdd product={product} tone={tone} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
