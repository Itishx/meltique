/**
 * Shopify connection settings.
 *
 * Everything here is server-only. The Storefront API is reached through our
 * own route handlers rather than from the browser, so no Shopify token is
 * ever shipped to the client.
 *
 * The whole integration is optional by design: with no token set,
 * `isShopifyConfigured` is false, every Shopify call short-circuits, and the
 * site runs exactly as it does today in pre-order mode. That is what lets
 * this land before the store is ready without breaking anything.
 */

/** Pinned deliberately. Shopify dates its API versions and retires them on a
 *  schedule, so an unpinned version is a silent future breakage. */
export const SHOPIFY_API_VERSION = "2026-07";

export const shopDomain = process.env.SHOPIFY_STORE_DOMAIN ?? "";

/** Private tokens get higher rate limits and must never reach the browser. */
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";

/** Public tokens also work server-side; supported as a fallback because the
 *  Headless channel shows both and it is easy to copy the wrong one. */
const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ?? "";

export const storefrontToken = privateToken || publicToken;
export const isPrivateToken = Boolean(privateToken);

export const isShopifyConfigured = Boolean(shopDomain && storefrontToken);

export const storefrontEndpoint = shopDomain
  ? `https://${shopDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`
  : "";

/** Currency the catalogue is priced in. Shopify returns its own currency per
 *  price; this is only the expectation we check against. */
export const expectedCurrency = "INR";
