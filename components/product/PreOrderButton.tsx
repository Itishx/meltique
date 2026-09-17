"use client";

import { useEffect, useRef, useState } from "react";

import { cartLineId, useCart } from "@/lib/cart";
import { clsx } from "@/lib/clsx";
import type { Product } from "@/lib/types";

/**
 * The pre-order call to action.
 *
 * This places a real order. "Pre-order" is the honest word for it because the
 * first run has not been made yet, not because the button is a stand-in: it
 * adds the box to the cart, and the cart checks out through Shopify like any
 * other purchase.
 *
 * Gold on chocolate is the loudest pairing the palette has, so this is the
 * only element that gets it at full width. Everything else on a product card
 * is a hairline or a piece of type, which is what lets one filled bar read as
 * the action without the page having to shout.
 */
export function PreOrderButton({
  product,
  label = "Get it now",
  tone = "dark",
  size = "md",
  className,
}: {
  product: Product;
  label?: string;
  /** `ivory` for the off-white sections, `dark` for the chocolate ground. */
  tone?: "ivory" | "dark";
  size?: "md" | "lg";
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

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
        /* The drawer opening is the real confirmation; this is just so the
           button itself acknowledges the press before it slides into view. */
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 2200);
      }}
      className={clsx(
        "label group relative flex w-full items-center justify-center gap-3 overflow-hidden",
        "bg-gold text-espresso transition-colors duration-500 ease-[var(--ease-silk)]",
        /* Ivory sections sit on paper, so the button needs its own edge to
           stop it floating; on chocolate the contrast already does that. */
        tone === "ivory" && "ring-1 ring-inset ring-black/5",
        size === "lg" ? "h-14" : "h-13",
        className,
      )}
    >
      {/* A warm wash that fills from the left on hover. A layer of its own
          rather than a background-colour swap, so it reads as light moving
          across foil rather than the button changing colour. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[#f6e3c8] transition-transform duration-[700ms] ease-[var(--ease-silk)] group-hover:scale-x-100"
      />
      <span className="relative">{added ? "Added to your box" : label}</span>
      <span
        aria-hidden
        className={clsx(
          "relative transition-transform duration-500 ease-[var(--ease-silk)]",
          added ? "translate-x-0" : "group-hover:translate-x-1",
        )}
      >
        {added ? "✓" : "→"}
      </span>
      <span className="sr-only">
        {added ? `${product.name} added to your box` : `Get ${product.name}`}
      </span>
    </button>
  );
}
