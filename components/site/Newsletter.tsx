"use client";

import { useState } from "react";
import { Media } from "@/components/ui/Media";

/**
 * Signup is deliberately inert until a provider is wired in — it validates,
 * acknowledges, and never pretends to have stored an address.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  return (
    <section className="gutter grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
      <div className="relative aspect-21/9 overflow-hidden lg:aspect-3/2">
        <Media
          src="/images/editorial/newsletter.jpg"
          alt="A Meltyk Signature Bite resting on its black lacquered tray"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="size-full object-cover"
        />
      </div>

      <div>
        <p className="label text-on-dark-muted">The letter</p>
        <h2 className="display mt-4 text-display-md">
          New releases, quietly announced.
        </h2>
        <p className="mt-4 max-w-[62ch] text-sm text-on-dark-muted">
          Seasonal editions run short and are not repeated. Subscribers hear first,
          roughly once a month, and never otherwise.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setState("done");
          }}
          className="mt-8 max-w-md"
        >
          <label htmlFor="newsletter-email" className="label text-on-dark-muted">
            Email address
          </label>
          <div className="mt-3 flex gap-3 border-b border-rule-dark pb-3">
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setState("idle");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-transparent text-sm text-on-dark placeholder:text-on-dark-muted/60 focus:outline-none"
            />
            <button type="submit" className="label shrink-0 text-gold link-draw">
              Subscribe
            </button>
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-xs text-on-dark-muted">
            {state === "done"
              ? "Thank you. Confirm the address from the note we just sent."
              : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
