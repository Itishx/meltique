"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { QuantityStepper } from "@/components/product/QuantityStepper";

/**
 * The cart, as a drawer. Focus moves into it on open and returns to the
 * trigger on close; Escape and the scrim both dismiss it.
 */
export function CartDrawer() {
  const { lines, isOpen, close, subtotalInPaise, setQuantity, remove, count } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      /* Keep Tab inside the drawer while it is open. */
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      restoreTo.current?.focus?.();
    };
  }, [isOpen, close]);


  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-espresso/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-[26rem] flex-col bg-paper text-ink shadow-2xl transition-transform duration-[600ms] ease-[var(--ease-silk)] ${
          isOpen
            ? "visible translate-x-0"
            : "invisible translate-x-0 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-5">
          <h2 className="label">
            Your selection
            <span aria-hidden className="ml-1.5 tabular-nums text-muted">
              ({count})
            </span>
          </h2>
          <button type="button" onClick={close} className="label link-draw">
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="display text-display-sm">Nothing chosen yet.</p>
            <p className="max-w-[32ch] text-sm text-muted">
              Every box is finished by hand the day it leaves us.
            </p>
            <Link
              href="/shop"
              onClick={close}
              className="label mt-2 border-b border-current pb-1"
            >
              Browse the range
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-rule overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={close}
                    className="relative block aspect-3/2 w-24 shrink-0 overflow-hidden bg-linen"
                  >
                    <Media
                      src={line.image}
                      alt={line.imageAlt}
                      sizes="96px"
                      quality={70}
                      className="size-full object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={close}
                          className="display block truncate text-lg leading-snug"
                        >
                          {line.name}
                        </Link>
                        {line.variantName ? (
                          <p className="label mt-1 text-muted">{line.variantName}</p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-sm tabular-nums">
                        {formatPrice(line.priceInPaise * line.quantity)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(next) => setQuantity(line.id, next)}
                        label={`Quantity for ${line.name}`}
                        compact
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

            <div className="border-t border-rule px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="label">Subtotal</span>
                <span className="display text-2xl tabular-nums">
                  {formatPrice(subtotalInPaise)}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted">{site.deliveryNote}</p>

              <Link
                href="/cart"
                onClick={close}
                className="label mt-5 flex h-13 w-full items-center justify-center bg-cocoa text-gold transition-colors duration-300 hover:bg-espresso"
              >
                Review and check out
              </Link>
              <p className="mt-3 text-center text-xs text-muted">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
