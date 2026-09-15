import { NextResponse } from "next/server";

import { isShopifyConfigured } from "@/lib/shopify/config";
import { createCart } from "@/lib/shopify/cart";
import { getCommerce } from "@/lib/shopify/catalogue";
import { ShopifyError } from "@/lib/shopify/client";

/**
 * Turns the browser's cart into a Shopify checkout.
 *
 * The local cart stays the source of truth for the UI: every add and quantity
 * change is instant and offline, with no round trip. Shopify only gets
 * involved at the moment of checkout, which is the first moment it actually
 * has to be authoritative.
 *
 * Variant ids are resolved here from the slug rather than read from the
 * posted body. A cart saved in localStorage last week, or saved before the
 * store existed at all, still checks out — and a variant re-created in the
 * Shopify admin does not strand anyone's cart.
 */

export const runtime = "nodejs";
/* Never prerender or cache: every call creates a real cart. */
export const dynamic = "force-dynamic";

interface RequestLine {
  slug: string;
  quantity: number;
}

function badRequest(reason: string) {
  return NextResponse.json({ error: reason }, { status: 400 });
}

export async function POST(request: Request) {
  if (!isShopifyConfigured) {
    /* 503 rather than 500: this is a configuration state, not a fault, and
       the client uses it to fall back to the pre-order flow. */
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Shopify is not connected yet. Pre-orders are still open.",
      },
      { status: 503 },
    );
  }

  let body: { lines?: RequestLine[] };
  try {
    body = await request.json();
  } catch {
    return badRequest("Body must be JSON.");
  }

  const requested = body.lines;
  if (!Array.isArray(requested) || requested.length === 0) {
    return badRequest("Send at least one line.");
  }

  const commerce = await getCommerce();
  if (commerce.size === 0) {
    return NextResponse.json(
      {
        error: "empty_catalogue",
        message:
          "Shopify has no products yet. Run `npm run shopify:sync` to create them.",
      },
      { status: 503 },
    );
  }

  const lines = [];
  const unavailable: string[] = [];

  for (const line of requested) {
    if (typeof line?.slug !== "string") return badRequest("Each line needs a slug.");

    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 12) {
      return badRequest(`Quantity for ${line.slug} must be between 1 and 12.`);
    }

    const match = commerce.get(line.slug);
    if (!match || !match.available) {
      unavailable.push(line.slug);
      continue;
    }
    lines.push({ merchandiseId: match.variantId, quantity });
  }

  if (lines.length === 0) {
    return NextResponse.json(
      {
        error: "unavailable",
        message: "Nothing in the cart is currently available.",
        unavailable,
      },
      { status: 409 },
    );
  }

  /* Shopify rate-limits private-token traffic per buyer, so it wants the
     shopper's address rather than Vercel's. */
  const buyerIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  try {
    const cart = await createCart(lines, buyerIp);
    return NextResponse.json({
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
      /* Reported so the client can tell the shopper what was dropped rather
         than silently checking out with less than they chose. */
      unavailable,
    });
  } catch (error) {
    const message =
      error instanceof ShopifyError ? error.message : "Could not reach Shopify.";
    console.error("[shopify] checkout failed:", error);
    return NextResponse.json({ error: "shopify_error", message }, { status: 502 });
  }
}
