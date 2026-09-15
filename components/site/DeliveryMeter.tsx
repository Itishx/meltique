import { formatPrice } from "@/lib/format";
import { offers } from "@/lib/site";

/**
 * How far the cart is from free delivery.
 *
 * A single hairline that fills with gold, not a chunky progress bar — the rest
 * of the cart is rules and type, and a heavy widget would be the loudest thing
 * in a drawer that is meant to feel like stationery.
 *
 * The threshold lives in lib/site.ts because it has to agree with a real
 * Shopify shipping rule. If Shopify does not actually stop charging delivery
 * at this number, this meter is a promise the checkout will break.
 */
export function DeliveryMeter({ subtotalInPaise }: { subtotalInPaise: number }) {
  const target = offers.freeDeliveryOverPaise;
  const remaining = Math.max(0, target - subtotalInPaise);
  const reached = remaining === 0;
  /* Clamped so an overflowing cart does not push the fill past its track. */
  const progress = Math.min(1, subtotalInPaise / target);

  return (
    <div className="border-b border-rule px-6 py-4">
      <p className="text-xs leading-relaxed">
        {reached ? (
          <span className="text-bronze-ink">
            Delivery is on us for this order.
          </span>
        ) : (
          <span className="text-muted">
            <span className="tabular-nums text-ink">{formatPrice(remaining)}</span>{" "}
            away from free delivery.
          </span>
        )}
      </p>

      <div
        className="mt-3 h-px w-full bg-rule"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Progress towards free delivery"
      >
        <div
          className="h-px origin-left bg-gold transition-transform duration-700 ease-[var(--ease-silk)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
