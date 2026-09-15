import type { Metadata } from "next";
import { CartView } from "@/components/site/CartView";

export const metadata: Metadata = {
  title: "Your selection",
  description: "Review your Meltyk selection before checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="gutter pb-24 pt-32 md:pt-40">
      <h1 className="display text-display-xl">Your selection</h1>
      <CartView />
    </div>
  );
}
