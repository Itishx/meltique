import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPolicy, policies } from "@/lib/policies";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return {
    title: policy.title,
    description: policy.summary,
    alternates: { canonical: `/policies/${policy.slug}` },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="gutter pb-28 pt-32 md:pt-40">
      <Reveal>
        <p className="label text-gold">Policies</p>
        <h1 className="display mt-5 text-display-xl">{policy.title}</h1>
        <p className="mt-5 max-w-[62ch] text-sm text-muted">{policy.summary}</p>
      </Reveal>

      <div className="mt-16 max-w-[74ch]">
        {policy.sections.map((section, index) => (
          <Reveal key={section.heading} delay={index * 60}>
            <section className="border-t border-rule py-8">
              <h2 className="display text-display-sm">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          </Reveal>
        ))}
      </div>

      <nav aria-label="Other policies" className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
        {policies
          .filter((p) => p.slug !== policy.slug)
          .map((p) => (
            <Link key={p.slug} href={`/policies/${p.slug}`} className="label link-draw">
              {p.title}
            </Link>
          ))}
      </nav>
    </div>
  );
}
