import "server-only";

import { storefront, ShopifyError } from "./client";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_QUERY,
} from "./queries";
import type { ShopifyCart, UserError } from "./types";

interface CartMutation {
  cart: ShopifyCart | null;
  userErrors: UserError[];
}

/** Shopify reports business-rule problems (sold out, bad variant) in
 *  `userErrors` with a 200, so they need lifting into real errors. */
function unwrap(result: CartMutation | undefined, operation: string): ShopifyCart {
  if (!result) throw new ShopifyError(`${operation} returned nothing.`);
  if (result.userErrors.length) {
    throw new ShopifyError(
      result.userErrors.map((error) => error.message).join("; "),
      result.userErrors,
    );
  }
  if (!result.cart) throw new ShopifyError(`${operation} returned no cart.`);
  return result.cart;
}

export interface LineInput {
  merchandiseId: string;
  quantity: number;
}

export async function createCart(lines: LineInput[], buyerIp?: string) {
  const data = await storefront<{ cartCreate: CartMutation }>(
    CART_CREATE,
    { lines },
    { buyerIp },
  );
  return unwrap(data.cartCreate, "cartCreate");
}

export async function getCart(id: string, buyerIp?: string) {
  const data = await storefront<{ cart: ShopifyCart | null }>(
    CART_QUERY,
    { id },
    { buyerIp },
  );
  return data.cart;
}

export async function addLines(cartId: string, lines: LineInput[], buyerIp?: string) {
  const data = await storefront<{ cartLinesAdd: CartMutation }>(
    CART_LINES_ADD,
    { cartId, lines },
    { buyerIp },
  );
  return unwrap(data.cartLinesAdd, "cartLinesAdd");
}

export async function updateLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
  buyerIp?: string,
) {
  const data = await storefront<{ cartLinesUpdate: CartMutation }>(
    CART_LINES_UPDATE,
    { cartId, lines },
    { buyerIp },
  );
  return unwrap(data.cartLinesUpdate, "cartLinesUpdate");
}

export async function removeLines(cartId: string, lineIds: string[], buyerIp?: string) {
  const data = await storefront<{ cartLinesRemove: CartMutation }>(
    CART_LINES_REMOVE,
    { cartId, lineIds },
    { buyerIp },
  );
  return unwrap(data.cartLinesRemove, "cartLinesRemove");
}
