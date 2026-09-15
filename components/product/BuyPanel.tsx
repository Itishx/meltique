"use client";

import Link from "next/link";
import { useState } from "react";

import { cartLineId, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { QuantityStepper } from "./QuantityStepper";

/**
 * Buying a box. There is one format, so there is nothing to configure beyond
 * how many — and pre-order leads, since the first run has not shipped.
 */
export function BuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="display text-3xl tabular-nums">
          {formatPrice(product.priceInPaise)}
        </p>
        <p className="label text-muted">{product.weight}</p>
      </div>

      <p className="mt-2 text-xs text-muted">{site.provisionalNote}</p>

      <dl className="mt-9 border-t border-rule pt-6">
        <dt className="label text-muted">Tasting notes</dt>
        <dd className="display mt-2 text-xl">{product.sensoryNotes.join(" · ")}</dd>
      </dl>

      <Link
        href="/pre-order"
        className="label mt-9 flex h-13 items-center justify-center bg-gold px-8 text-espresso transition-colors duration-300 hover:bg-on-dark"
      >
        Pre-order this box
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          label={`Quantity for ${product.name}`}
        />

        <button
          type="button"
          onClick={() => {
            add(
              {
                id: cartLineId(product.slug),
                slug: product.slug,
                name: product.name,
                priceInPaise: product.priceInPaise,
                image: product.images[0].src,
                imageAlt: product.images[0].alt,
              },
              quantity,
            );
            setAdded(true);
          }}
          className="label h-13 min-w-[13rem] flex-1 border border-rule px-8 transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          Add to cart · {formatPrice(product.priceInPaise * quantity)}
        </button>
      </div>

      <p aria-live="polite" className="mt-5 text-xs text-muted">
        {added ? "Added to your cart. " : ""}
        {site.preOrderNote}
      </p>
    </div>
  );
}
