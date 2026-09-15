"use client";

import type { CartLine } from "./cart-store";

export type CheckoutResult =
  | { kind: "redirect"; url: string; unavailable: string[] }
  /* Shopify is not connected yet: the caller sends the shopper to pre-order
     instead of showing an error, because that is the truthful state of the
     business rather than a failure. */
  | { kind: "pre-order"; message: string }
  | { kind: "error"; message: string };

/**
 * Hands the cart to Shopify and returns where the shopper should go next.
 *
 * Deliberately returns a result rather than throwing or navigating: the
 * "not connected yet" case is a normal state of this project, not an
 * exception, and the caller decides how to present it.
 */
export async function startCheckout(lines: CartLine[]): Promise<CheckoutResult> {
  if (lines.length === 0) {
    return { kind: "error", message: "Your cart is empty." };
  }

  let response: Response;
  try {
    response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
      }),
    });
  } catch {
    return { kind: "error", message: "Could not reach the store. Check your connection." };
  }

  let body: {
    checkoutUrl?: string;
    unavailable?: string[];
    error?: string;
    message?: string;
  };
  try {
    body = await response.json();
  } catch {
    return { kind: "error", message: "The store sent an unreadable response." };
  }

  if (response.status === 503) {
    return {
      kind: "pre-order",
      message: body.message ?? "Pre-orders are open while the store is being set up.",
    };
  }

  if (!response.ok || !body.checkoutUrl) {
    return {
      kind: "error",
      message: body.message ?? "Checkout is unavailable right now.",
    };
  }

  return {
    kind: "redirect",
    url: body.checkoutUrl,
    unavailable: body.unavailable ?? [],
  };
}
