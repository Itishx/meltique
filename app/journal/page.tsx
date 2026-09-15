import type { Metadata } from "next";
import Link from "next/link";

import { sortedArticles } from "@/lib/journal";
import { formatDate } from "@/lib/format";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on origin, craft, pairing and gifting from the Meltyk kitchen.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, ...rest] = sortedArticles();

  return (
    <div className="gutter pb-24 pt-32 md:pt-40">
      <Reveal>
        <p className="label text-bronze-ink">The journal</p>
        <h1 className="display mt-5 max-w-[26ch] text-display-xl">
          Notes from the kitchen.
        </h1>
      </Reveal>

      <Reveal className="mt-16">
        <Link href={`/journal/${lead.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-3/2 overflow-hidden bg-linen">
            <Media
              src={lead.image.src}
              alt={lead.image.alt}
              sizes="(min-width: 1024px) 50vw, 92vw"
              priority
              className="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
            />
          </div>
          <div>
            <p className="label text-bronze-ink">{lead.category}</p>
            <h2 className="display mt-4 text-display-lg">{lead.title}</h2>
            <p className="mt-4 max-w-[68ch] text-base text-muted">{lead.excerpt}</p>
            <p className="label mt-6 text-muted">
              {formatDate(lead.date)} · {lead.readingMinutes} min read
            </p>
          </div>
        </Link>
      </Reveal>

      <ul className="mt-24 grid gap-x-6 gap-y-16 border-t border-rule pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article, index) => (
          <li key={article.slug}>
            <Reveal delay={(index % 3) * 90}>
              <Link href={`/journal/${article.slug}`} className="group block">
                <div className="relative aspect-3/2 overflow-hidden bg-linen">
                  <Media
                    src={article.image.src}
                    alt={article.image.alt}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
                    className="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-105"
                  />
                </div>
                <p className="label mt-5 text-bronze-ink">{article.category}</p>
                <h2 className="display mt-2 text-xl leading-snug">{article.title}</h2>
                <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                <p className="label mt-3 text-muted">
                  {formatDate(article.date)} · {article.readingMinutes} min
                </p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
