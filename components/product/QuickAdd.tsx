"use client";

import { useState } from "react";

import { cartLineId, useCart } from "@/lib/cart";
import { clsx } from "@/lib/clsx";
import type { Product } from "@/lib/types";

/**
 * The circular add control in the flavour grid. Adds a single cube — the
 * entry pack — and confirms in place rather than navigating away.
 */
export function QuickAdd({
  product,
  tone = "ivory",
}: {
  product: Product;
  tone?: "ivory" | "dark";
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const ivory = tone === "ivory";

  return (
    <button
      type="button"
      onClick={() => {
        add({
          id: cartLineId(product.slug),
          slug: product.slug,
          name: product.name,
          priceInPaise: product.priceInPaise,
          image: product.images[0].src,
          imageAlt: product.images[0].alt,
        });
        setAdded(true);
      }}
      className={clsx(
        "flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
        ivory
          ? "border-rule-ivory text-ink-ivory hover:border-ink-ivory hover:bg-ink-ivory hover:text-ivory"
          : "border-rule text-ink hover:border-gold hover:bg-gold hover:text-espresso",
      )}
    >
      {/* A plus drawn from two rules, so it stays crisp at any size. */}
      <span aria-hidden className="relative block size-3">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
      </span>
      <span className="sr-only">
        {added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
      </span>
    </button>
  );
}
