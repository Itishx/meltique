import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutPlaceholder } from "@/components/site/CheckoutPlaceholder";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MELTYK order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="gutter pb-28 pt-32 md:pt-40">
      <p className="label text-gold">Checkout</p>
      <h1 className="display mt-5 text-display-xl">Almost yours.</h1>
      <CheckoutPlaceholder />
      <Link href="/cart" className="label link-draw mt-12 inline-block">
        Back to cart
      </Link>
    </div>
  );
}
