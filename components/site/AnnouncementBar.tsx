"use client";

import { useState } from "react";

import { offers } from "@/lib/site";
import { useHydrated } from "@/lib/cart";

const DISMISSED_KEY = "meltyk.promo.v1";

function wasDismissed() {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === offers.promo.code;
  } catch {
    /* Blocked storage just means the bar shows again. Harmless. */
    return false;
  }
}

/**
 * The promo bar.
 *
 * Lives inside the header rather than above it: the header is fixed, so a
 * separate bar in normal flow would slide under it and vanish. Being a row of
 * the same fixed element keeps it visible and keeps the page's top padding
 * honest.
 *
 * Deliberately not a loud strip. On a brand built out of hairlines and
 * chocolate, a bright banner reads as a different website — so it is set on
 * espresso with gold type, and the code itself carries the only border.
 *
 * Keyed on the promo code: change the code and the bar returns for everyone,
 * including people who dismissed the previous one.
 */
export function AnnouncementBar() {
  const ready = useHydrated();
  const [closed, setClosed] = useState(false);

  /* Rendered on the server and hidden after hydration if already dismissed,
     rather than the reverse — a bar that pops in late shifts the whole page
     down under the reader. */
  if (closed || (ready && wasDismissed())) return null;

  return (
    <div className="relative border-b border-rule-dark bg-espresso text-on-dark">
      <div className="gutter flex h-9 items-center justify-center gap-x-4 gap-y-1 pr-8 text-center md:h-10">
        {/* The code is the only part that has to survive a narrow screen, so
            the description shortens around it rather than the line truncating
            and eating the code. */}
        <p className="label flex min-w-0 items-center justify-center text-gold">
          <span className="truncate">
            <span className="hidden sm:inline">{offers.promo.line}</span>
            <span className="sm:hidden">{offers.promo.shortLine}</span>
          </span>
          <span aria-hidden className="mx-2.5 shrink-0 text-on-dark-muted">
            &middot;
          </span>
          <span className="shrink-0 whitespace-nowrap border border-gold/45 px-2 py-0.5 text-on-dark">
            {offers.promo.code}
          </span>
          <span className="ml-2.5 hidden shrink-0 text-on-dark-muted md:inline">
            at checkout
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setClosed(true);
          try {
            window.localStorage.setItem(DISMISSED_KEY, offers.promo.code);
          } catch {
            /* Then it comes back next visit, which is the safe direction. */
          }
        }}
        aria-label="Dismiss offer"
        className="absolute inset-y-0 right-1 flex w-9 items-center justify-center text-on-dark-muted transition-colors duration-300 hover:text-on-dark"
      >
        {/* Drawn from two rules so it stays crisp and matches the quick-add
            plus elsewhere in the house style. */}
        <span aria-hidden className="relative block size-2.5">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rotate-45 bg-current" />
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 -rotate-45 bg-current" />
        </span>
      </button>
    </div>
  );
}
