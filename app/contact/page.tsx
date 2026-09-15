import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MELTYK about orders, gifting or wholesale.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="gutter pb-28 pt-32 md:pt-40">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="label text-gold">Contact</p>
          <h1 className="display mt-5 max-w-[24ch] text-display-xl">
            Talk to us.
          </h1>
          <p className="mt-6 max-w-[58ch] text-sm text-muted">
            Questions about an order, a gift, or working together. This reaches
            us directly.
          </p>

          <dl className="mt-12 space-y-6 border-t border-rule pt-8">
            <div>
              <dt className="label text-muted">General</dt>
              <dd className="mt-2 text-sm">Contact address to be confirmed.</dd>
            </div>
            <div>
              <dt className="label text-muted">Gifting and corporate</dt>
              <dd className="mt-2 text-sm">Contact address to be confirmed.</dd>
            </div>
            <div>
              <dt className="label text-muted">Elsewhere</dt>
              <dd className="mt-2 text-sm">
                <Link href="/faq" className="link-draw">
                  Read the FAQ
                </Link>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
