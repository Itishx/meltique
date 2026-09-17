import { clsx } from "@/lib/clsx";
import { formatPrice } from "@/lib/format";
import { priceOf } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/**
 * A price, with the list price struck through when there is a saving.
 *
 * One component rather than the same two spans written out at a dozen call
 * sites, so the struck figure always sits in the same place, at the same
 * relative size, in the same muted tone — and so ending the launch offer is
 * one edit in lib/pricing.ts rather than a hunt through the pages.
 */
export function Price({
  product,
  size = "md",
  tone = "dark",
  className,
}: {
  product: Pick<Product, "priceInPaise">;
  size?: "sm" | "md" | "lg";
  /** `ivory` for the off-white sections, `dark` for the chocolate ground. */
  tone?: "ivory" | "dark";
  className?: string;
}) {
  const { now, was } = priceOf(product);

  const nowSize =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const wasSize =
    size === "lg" ? "text-lg" : size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={clsx("flex flex-wrap items-baseline gap-x-2.5", className)}>
      <span className={clsx("display tabular-nums", nowSize)}>
        {formatPrice(now)}
      </span>

      {was ? (
        <>
          {/* line-through rather than a decorative strike, so it is announced
              as a former price by screen readers too. */}
          <s
            className={clsx(
              "display tabular-nums decoration-from-font",
              wasSize,
              tone === "ivory" ? "text-muted-ivory" : "text-muted",
            )}
          >
            {formatPrice(was)}
          </s>
          <span className="sr-only">
            reduced from {formatPrice(was)} to {formatPrice(now)}
          </span>
        </>
      ) : null}
    </span>
  );
}
