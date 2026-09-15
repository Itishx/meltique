/**
 * Storefront GraphQL documents.
 *
 * Kept as plain strings in one file so the whole API surface we depend on is
 * readable in a single sitting, and so a version bump has one place to check.
 */

const MONEY = `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const CART_FIELDS = `
  ${MONEY}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...Money }
      totalAmount { ...Money }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { ...Money }
            product { handle title }
            image { url altText }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  ${CART_FIELDS}
  query Cart($id: ID!) {
    cart(id: $id) { ...CartFields }
  }
`;

export const CART_CREATE = `
  ${CART_FIELDS}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD = `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE = `
  ${CART_FIELDS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE = `
  ${CART_FIELDS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

/** Everything commerce needs about the catalogue. Editorial content stays in
 *  lib/products.ts — Shopify only supplies price, stock and variant ids. */
export const PRODUCTS_QUERY = `
  ${MONEY}
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        availableForSale
        totalInventory
        priceRange { minVariantPrice { ...Money } }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            quantityAvailable
            price { ...Money }
          }
        }
      }
    }
  }
`;

export const SHOP_QUERY = `
  query Shop {
    shop {
      name
      primaryDomain { url }
      paymentSettings { currencyCode enabledPresentmentCurrencies }
    }
  }
`;
