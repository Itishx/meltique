/** Shapes returned by the Storefront documents in ./queries.ts. */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  totalInventory: number | null;
  priceRange: { minVariantPrice: Money };
  variants: { nodes: ShopifyVariant[] };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: Money;
    product: { handle: string; title: string };
    image: { url: string; altText: string | null } | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: ShopifyCartLine[] };
}

export interface UserError {
  field: string[] | null;
  message: string;
}

/** Money crosses our boundary as paise, matching lib/products.ts. Shopify
 *  sends decimal strings, so this is the one place they convert. */
export function toPaise(money: Money): number {
  return Math.round(Number.parseFloat(money.amount) * 100);
}
