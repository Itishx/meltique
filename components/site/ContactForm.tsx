"use client";

import { useState } from "react";

const FIELD =
  "mt-2 w-full border border-rule bg-deep px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-gold focus:outline-none";

/**
 * Contact form. There is no endpoint yet, so it validates and reports plainly
 * rather than pretending a message was delivered.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="border-t border-rule pt-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="label text-muted">Name</span>
          <input name="name" required autoComplete="name" className={FIELD} />
        </label>
        <label className="block">
          <span className="label text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={FIELD}
          />
        </label>
      </div>

      <label className="mt-6 block">
        <span className="label text-muted">Subject</span>
        <select name="subject" className={FIELD} defaultValue="order">
          <option value="order">An order</option>
          <option value="gifting">Gifting or corporate</option>
          <option value="wholesale">Wholesale</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className="mt-6 block">
        <span className="label text-muted">Message</span>
        <textarea name="message" rows={6} required className={`${FIELD} resize-none`} />
      </label>

      <button
        type="submit"
        className="label mt-8 h-13 w-full bg-gold px-8 text-espresso transition-colors duration-300 hover:bg-on-dark sm:w-auto"
      >
        Send message
      </button>

      <p aria-live="polite" className="mt-4 text-xs text-muted">
        {sent
          ? "This form is not connected to a mailbox yet. Nothing was sent. The address will be published before launch."
          : "We reply to everything, usually within a couple of days."}
      </p>
    </form>
  );
}
