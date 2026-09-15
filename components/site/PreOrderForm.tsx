"use client";

import { useState } from "react";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const FIELD =
  "mt-2 w-full border border-rule bg-deep px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-gold focus:outline-none";

/**
 * Pre-order reservation. There is no backend yet, so it validates and says so
 * plainly rather than implying an order was placed.
 */
export function PreOrderForm({ products }: { products: Product[] }) {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="border-t border-rule pt-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted">Name</span>
          <input name="name" required autoComplete="name" className={FIELD} />
        </label>
        <label className="block">
          <span className="label text-muted">Email</span>
          <input name="email" type="email" required autoComplete="email" className={FIELD} />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="label text-muted">Which box</legend>
        <div className="mt-4 space-y-px">
          {products.map((product, index) => (
            <label
              key={product.slug}
              className="flex cursor-pointer items-center gap-4 border border-rule px-4 py-3.5 transition-colors has-checked:border-gold"
            >
              <input
                type="radio"
                name="box"
                value={product.slug}
                defaultChecked={index === 0}
                className="sr-only"
              />
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full ring-1 ring-inset ring-white/20"
                style={{ backgroundColor: product.swatch }}
              />
              <span className="flex-1 text-sm">{product.name}</span>
              <span className="text-sm tabular-nums text-muted">
                {formatPrice(product.priceInPaise)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted">How many boxes</span>
          <input
            name="quantity"
            type="number"
            min={1}
            max={50}
            defaultValue={1}
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="label text-muted">City</span>
          <input name="city" autoComplete="address-level2" className={FIELD} />
        </label>
      </div>

      <label className="mt-6 block">
        <span className="label text-muted">
          Anything else
          <span className="ml-2 opacity-70">Optional</span>
        </span>
        <textarea name="notes" rows={4} className={`${FIELD} resize-none`} />
      </label>

      <button
        type="submit"
        className="label mt-8 h-13 w-full bg-gold px-8 text-espresso transition-colors duration-300 hover:bg-on-dark sm:w-auto"
      >
        Reserve my box
      </button>

      <p aria-live="polite" className="mt-4 text-xs text-muted">
        {sent
          ? "This form is not connected to a backend yet. Nothing was submitted and no payment was taken. It will be live before the first run."
          : "Nothing is charged now. We will confirm price and dispatch before anything is finalised."}
      </p>
    </form>
  );
}
