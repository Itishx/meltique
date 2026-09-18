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
        /* Shown to a shopper, so it says what they can do rather than what
           the store is missing. */
        message:
          "Checkout is briefly unavailable. Reserve your box and we will email you the moment it opens.",
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
    console.error(
      "[shopify] checkout blocked: storefront sees no products. Check they are" +
        " published to the Headless sales channel and that shopifyHandle in" +
        " lib/products.ts matches the handles the POS created.",
    );
    return NextResponse.json(
      {
        error: "empty_catalogue",
        /* This one leaked a developer instruction to customers. Whatever the
           operational cause — an empty catalogue, products not published to
           the sales channel — the shopper only needs to know it is us, not
           them, and what to do next. */
        message:
          "We cannot take orders this minute. Reserve your box and we will email you as soon as we can.",
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
        message:
          "Everything in your box has just sold out. Reserve one and we will email you when the next run is ready.",
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
