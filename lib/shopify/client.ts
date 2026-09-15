import "server-only";

import {
  isPrivateToken,
  isShopifyConfigured,
  storefrontEndpoint,
  storefrontToken,
} from "./config";

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}

/**
 * One POST to the Storefront GraphQL endpoint.
 *
 * `buyerIp` is forwarded when we hold a private token: Shopify uses it to
 * rate-limit per shopper rather than per server, which otherwise looks like
 * one very busy client coming from Vercel.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { buyerIp?: string; cache?: RequestCache; revalidate?: number } = {},
): Promise<T> {
  if (!isShopifyConfigured) {
    throw new ShopifyError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and a Storefront token.",
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isPrivateToken) {
    headers["Shopify-Storefront-Private-Token"] = storefrontToken;
    if (options.buyerIp) headers["Shopify-Storefront-Buyer-IP"] = options.buyerIp;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = storefrontToken;
  }

  let response: Response;
  try {
    response = await fetch(storefrontEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      /* Cart mutations must never be cached; catalogue reads opt in. */
      ...(options.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : { cache: options.cache ?? "no-store" }),
    });
  } catch (cause) {
    throw new ShopifyError("Could not reach Shopify.", cause);
  }

  if (!response.ok) {
    throw new ShopifyError(
      `Shopify returned ${response.status} ${response.statusText}.`,
      await response.text().catch(() => undefined),
    );
  }

  const body = (await response.json()) as GraphQLResponse<T>;

  if (body.errors?.length) {
    throw new ShopifyError(
      body.errors.map((error) => error.message).join("; "),
      body.errors,
    );
  }

  if (!body.data) throw new ShopifyError("Shopify returned no data.");
  return body.data;
}
