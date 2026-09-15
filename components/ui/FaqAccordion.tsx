"use client";

import { useId } from "react";

import { clsx } from "@/lib/clsx";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * A plain disclosure list built on <details>, so it opens without JavaScript
 * and is keyboard-operable by default. Only the marker and spacing are styled.
 */
export function FaqAccordion({
  items,
  tone = "dark",
}: {
  items: FaqItem[];
  /** `dark` sits on brown; `ivory` on the off-white breathing sections. */
  tone?: "dark" | "ivory";
}) {
  const id = useId();
  const ivory = tone === "ivory";

  return (
    <div className={clsx("border-t", ivory ? "border-rule-ivory" : "border-rule")}>
      {items.map((item) => (
        <details
          key={item.question}
          name={`faq-${id}`}
          className={clsx("group border-b", ivory ? "border-rule-ivory" : "border-rule")}
        >
          <summary className="flex cursor-pointer list-none items-center gap-8 py-8 [&::-webkit-details-marker]:hidden">
            {/* The open question takes the foil sweep. */}
            <span className="display flex-1 text-[1.375rem] leading-[1.3] transition-opacity duration-300 group-hover:opacity-70 group-open:shimmer md:text-2xl">
              {item.question}
            </span>

            {/* A plus that becomes a minus. Rotation is the only motion. */}
            <span
              aria-hidden
              className={clsx(
                "relative size-3.5 shrink-0 transition-colors duration-500",
                ivory ? "text-muted-ivory group-open:text-bronze" : "text-gold",
              )}
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[var(--ease-silk)] group-open:rotate-90" />
            </span>
          </summary>

          <p
            className={clsx(
              "max-w-[82ch] pb-10 pr-6 text-base leading-[1.9]",
              ivory ? "text-muted-ivory" : "text-muted",
            )}
          >
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
