"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart, useHydrated } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { Media } from "@/components/ui/Media";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { DeliveryMeter } from "./DeliveryMeter";

/**
 * The full cart.
 *
 * Checkout hands the basket to Shopify and follows the checkout URL it
 * returns. Until the store is connected the same button reports that plainly
 * and points at pre-order, rather than pretending to take money.
 */
export function CartView() {
  const { lines, subtotalInPaise, setQuantity, remove } = useCart();
  const ready = useHydrated();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "pre-order" | "error">(
    "idle",
  );
  const [note, setNote] = useState("");

  const onCheckout = async () => {
    setStatus("working");
    setNote("");
    const result = await startCheckout(lines);

    if (result.kind === "redirect") {
      /* Shopify owns the rest: payment, tax, address, confirmation. */
      window.location.href = result.url;
      return;
    }
    setStatus(result.kind === "pre-order" ? "pre-order" : "error");
    setNote(result.message);
  };

  if (!ready) {
    return <p className="mt-12 text-sm text-muted">Loading your selection…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-16 border-t border-rule pt-16">
        <p className="display text-display-sm">Nothing chosen yet.</p>
        <p className="mt-3 max-w-[56ch] text-sm text-muted">
          Every box is finished by hand the day it leaves us.
        </p>
        <Link href="/shop" className="label link-draw mt-8 inline-block">
          Browse the range
        </Link>
      </div>
    );
  }


  return (
    <div className="mt-14 grid gap-16 border-t border-rule pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
      <section aria-labelledby="lines">
        <h2 id="lines" className="sr-only">
          Items
        </h2>
        <ul className="divide-y divide-rule">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-5 py-7 sm:gap-7">
              <Link
                href={`/product/${line.slug}`}
                className="relative block aspect-square w-24 shrink-0 overflow-hidden bg-linen sm:w-32"
              >
                <Media
                  src={line.image}
                  alt={line.imageAlt}
                  sizes="(min-width: 640px) 128px, 96px"
                  className="size-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${line.slug}`} className="display text-xl">
                      {line.name}
                    </Link>
                    {line.variantName ? (
                      <p className="label mt-1.5 text-muted">{line.variantName}</p>
                    ) : null}
                  </div>
                  <p className="text-sm tabular-nums">
                    {formatPrice(line.priceInPaise * line.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                  <QuantityStepper
                    value={line.quantity}
                    onChange={(next) => setQuantity(line.id, next)}
                    label={`Quantity for ${line.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    className="label text-muted link-draw"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-rule pt-8">
          <label htmlFor="gift-message" className="label">
            Gift message
            <span className="ml-2 text-muted">Optional, written by hand</span>
          </label>
          <textarea
            id="gift-message"
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, 240))}
            rows={3}
            placeholder="A short, specific line outlasts the chocolate."
            className="mt-4 w-full resize-none border border-rule bg-deep px-4 py-3 text-sm placeholder:text-muted/70 focus:border-muted focus:outline-none"
          />
          <p className="mt-2 text-xs text-muted tabular-nums">{message.length}/240</p>
        </div>
      </section>

      <section aria-labelledby="summary" className="lg:sticky lg:top-28 lg:self-start">
        <h2 id="summary" className="label border-b border-rule pb-4">
          Summary
        </h2>

<div className="-mx-6 mb-6 border-y border-rule">
          <DeliveryMeter subtotalInPaise={subtotalInPaise} />
        </div>

                <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotalInPaise)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-right text-muted">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between border-t border-rule pt-4">
            <dt className="label pt-1">Subtotal</dt>
            <dd className="display text-2xl tabular-nums">{formatPrice(subtotalInPaise)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onCheckout}
          disabled={status === "working"}
          className="label mt-8 h-13 w-full bg-cocoa text-gold transition-colors duration-300 hover:bg-espresso disabled:opacity-60"
        >
          {status === "working" ? "Opening checkout…" : "Proceed to checkout"}
        </button>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Each cube is solid and dense, not aerated. One is enough, which is why
          a box of four goes further than it looks.{" "}
          <Link href="/faq" className="link-draw text-gold">
            More on the pricing
          </Link>
        </p>

        <p aria-live="polite" className="mt-4 text-xs text-muted">
          {status === "pre-order" || status === "error"
            ? note
            : "Taxes calculated at checkout. Dispatched within two working days."}
        </p>

        {status === "pre-order" ? (
          <Link href="/pre-order" className="label link-draw mt-4 inline-block text-gold">
            Reserve a box instead
          </Link>
        ) : null}
      </section>
    </div>
  );
}
