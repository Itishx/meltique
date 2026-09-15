"use client";

import Link from "next/link";

import { useCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

/**
 * Checkout is not connected to a payment provider. This summarises the order
 * and says so plainly rather than collecting details it cannot process.
 */
export function CheckoutPlaceholder() {
  const { lines, subtotalInPaise } = useCart();
  const ready = useHydrated();

  if (!ready) {
    return <p className="mt-10 text-sm text-muted">Loading your order…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-12 border-t border-rule pt-10">
        <p className="display text-display-sm">There is nothing to check out.</p>
        <Link href="/shop" className="label link-draw mt-6 inline-block text-gold">
          Shop chocolate
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-4xl border-t border-rule pt-10">
      <h2 className="label text-muted">Your order</h2>
      <ul className="mt-6 divide-y divide-rule">
        {lines.map((line) => (
          <li key={line.id} className="flex justify-between gap-6 py-4 text-sm">
            <span>
              {line.name}
              {line.variantName ? (
                <span className="text-muted"> · {line.variantName}</span>
              ) : null}
              <span className="text-muted"> × {line.quantity}</span>
            </span>
            <span className="tabular-nums">
              {formatPrice(line.priceInPaise * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between border-t border-rule pt-6">
        <span className="label pt-1">Subtotal</span>
        <span className="display text-2xl tabular-nums">
          {formatPrice(subtotalInPaise)}
        </span>
      </div>

      <div className="mt-10 border border-rule p-6">
        <p className="label text-gold">Not yet available</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Payment is not connected yet, so no order can be placed and no card
          details are collected here. {site.deliveryNote}
        </p>
      </div>
    </div>
  );
}
