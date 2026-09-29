import type { Metadata } from "next";
import Link from "next/link";

import { business } from "@/lib/site";
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

          {/* A payment gateway, a courier and a customer all need to find
              these, so they are plain text on the page rather than hidden
              behind the form. */}
          <dl className="mt-12 space-y-6 border-t border-rule pt-8">
            <div>
              <dt className="label text-muted">Email</dt>
              <dd className="mt-2 text-sm">
                <a href={`mailto:${business.email}`} className="link-draw">
                  {business.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Phone</dt>
              <dd className="mt-2 text-sm">
                <a href={`tel:${business.phoneHref}`} className="link-draw">
                  {business.phone}
                </a>
                <span className="block text-muted">Mon to Sat, 10am to 6pm IST</span>
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Address</dt>
              <dd className="mt-2 text-sm">
                <address className="not-italic text-muted">
                  {business.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </dd>
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
