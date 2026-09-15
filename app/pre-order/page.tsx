import type { Metadata } from "next";

import { products } from "@/lib/products";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { PreOrderForm } from "@/components/site/PreOrderForm";

export const metadata: Metadata = {
  title: "Pre-order",
  description:
    "Reserve a MELTYK Box of 4 ahead of the first run. Nothing is charged now.",
  alternates: { canonical: "/pre-order" },
};

export default function PreOrderPage() {
  return (
    <div className="gutter pb-28 pt-32 md:pt-40">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="label text-gold">Pre-order</p>
          <h1 className="display mt-5 max-w-[24ch] text-display-xl">
            Reserve a box.
          </h1>
          <p className="mt-6 max-w-[60ch] text-base text-muted">
            {site.preOrderNote} Tell us which box you want and we will come back
            to you with dispatch dates and the final price before anything is
            confirmed.
          </p>

          <dl className="mt-12 space-y-6 border-t border-rule pt-8">
            <div>
              <dt className="label text-muted">One format</dt>
              <dd className="mt-2 text-sm">
                A Box of 4: four cubes of one flavour, or one of each.
              </dd>
            </div>
            <div>
              <dt className="label text-muted">From</dt>
              <dd className="mt-2 text-sm">₹350 a box. {site.provisionalNote}</dd>
            </div>
            <div>
              <dt className="label text-muted">Payment</dt>
              <dd className="mt-2 text-sm">
                Nothing is charged at pre-order. {site.deliveryNote}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <PreOrderForm products={products} />
        </Reveal>
      </div>
    </div>
  );
}
