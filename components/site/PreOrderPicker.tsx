import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Media } from "@/components/ui/Media";
import { PreOrderButton } from "@/components/product/PreOrderButton";

/**
 * Choose a box and pre-order it.
 *
 * This replaced a contact form that asked for name, email, city and a box,
 * then discarded all of it — there was no backend behind it, so anyone who
 * filled it in believed they had reserved something and we never saw it.
 *
 * Now the store is connected there is no reason to ask twice: the box goes
 * into the cart, and Shopify's checkout collects the delivery address and
 * payment properly, which is also where that data belongs rather than in a
 * form we would have to secure ourselves.
 */
export function PreOrderPicker({ products }: { products: Product[] }) {
  return (
    <div className="border-t border-rule pt-8">
      <h2 className="label text-muted">Choose your box</h2>

      <ul className="mt-6 space-y-5">
        {products.map((product) => (
          <li
            key={product.slug}
            className="flex flex-col gap-5 border border-rule p-5 transition-colors duration-500 hover:border-gold/40 sm:flex-row sm:items-center"
          >
            <div
              className="relative hidden aspect-square w-24 shrink-0 overflow-hidden sm:block"
              style={{ backgroundColor: product.backdrop }}
            >
              <Media
                src={product.images[0].src}
                alt={product.images[0].alt}
                sizes="96px"
                quality={70}
                className="size-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="display text-xl leading-tight">{product.name}</p>
              <p className="mt-1.5 text-sm text-muted">{product.inside ?? product.summary}</p>
              <p className="mt-3 flex items-baseline gap-3">
                <span className="display text-xl tabular-nums">
                  {formatPrice(product.priceInPaise)}
                </span>
                <span className="label text-muted">{product.weight}</span>
              </p>
            </div>

            <PreOrderButton
              product={product}
              label="Pre-order"
              className="sm:w-48 sm:shrink-0"
            />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Delivery address and payment are collected at checkout. Your card
        details never touch this site.
      </p>
    </div>
  );
}
