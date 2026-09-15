import type { Metadata } from "next";
import Link from "next/link";

import { faqs } from "@/lib/faq";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Ingredients, allergens, storage, pack sizes and delivery. The questions worth answering before you order.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="gutter pb-28 pt-32 md:pt-40">
      <Reveal>
        <p className="label text-gold">Questions</p>
        <h1 className="display mt-5 max-w-[26ch] text-display-xl">
          Before you order.
        </h1>
      </Reveal>

      <div className="mt-16 max-w-5xl">
        <Reveal>
          <FaqAccordion items={faqs} />
        </Reveal>

        <Reveal className="mt-14 border-t border-rule pt-10">
          <p className="display text-display-sm">Still need an answer?</p>
          <p className="mt-3 max-w-[62ch] text-sm text-muted">
            Anything not covered here, ask us directly.
          </p>
          <Link href="/contact" className="label link-draw mt-6 inline-block text-gold">
            Contact us
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
