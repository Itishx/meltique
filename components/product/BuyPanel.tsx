"use client";

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

      {/* One action, not two. This used to sit under a gold link to the
          pre-order form, which read as the primary route but reached a page
          that could not take an order. The real order path gets the gold. */}
      <div className="mt-9 flex flex-wrap items-center gap-4">
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
          className="label group relative h-14 min-w-[15rem] flex-1 overflow-hidden bg-gold px-8 text-espresso transition-colors duration-500"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-[#f6e3c8] transition-transform duration-[700ms] ease-[var(--ease-silk)] group-hover:scale-x-100"
          />
          <span className="relative">
            Pre-order now · {formatPrice(product.priceInPaise * quantity)}
          </span>
        </button>
      </div>

      <p aria-live="polite" className="mt-5 text-xs text-muted">
        {added ? "Added to your cart. " : ""}
        {site.preOrderNote}
      </p>
    </div>
  );
}
