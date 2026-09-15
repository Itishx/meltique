import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { articles, getArticle, sortedArticles } from "@/lib/journal";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      images: [{ url: article.image.src, alt: article.image.alt }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = sortedArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    image: new URL(article.image.src, site.url).toString(),
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: new URL(`/journal/${article.slug}`, site.url).toString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-24 pt-32 md:pt-40">
        <header className="gutter">
          <nav aria-label="Breadcrumb" className="label mb-10 text-muted">
            <Link href="/journal" className="link-draw">
              Journal
            </Link>
            <span aria-hidden className="mx-2 opacity-40">
              /
            </span>
            <span className="text-ink">{article.category}</span>
          </nav>

          <h1 className="display max-w-[30ch] text-display-xl">{article.title}</h1>
          <p className="label mt-8 text-muted">
            {formatDate(article.date)} · {article.readingMinutes} min read
          </p>
        </header>

        <div className="gutter mt-14">
          <div className="relative aspect-3/2 overflow-hidden bg-linen">
            <Media
              src={article.image.src}
              alt={article.image.alt}
              sizes="100vw"
              quality={92}
              priority
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="gutter mt-16">
          <div className="mx-auto max-w-[72ch]">
            <p className="display text-display-sm leading-relaxed">{article.excerpt}</p>

            <div className="mt-12 space-y-6">
              {article.body.map((block) =>
                block.startsWith("## ") ? (
                  <h2 key={block} className="display pt-6 text-display-sm">
                    {block.slice(3)}
                  </h2>
                ) : (
                  <p key={block} className="text-base leading-[1.85]">
                    {block}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>

        <section className="gutter mt-24" aria-labelledby="more">
          <Reveal className="border-t border-rule pt-10">
            <h2 id="more" className="display text-display-md">
              Keep reading
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {more.map((item, index) => (
              <li key={item.slug}>
                <Reveal delay={index * 90}>
                  <Link href={`/journal/${item.slug}`} className="group block">
                    <div className="relative aspect-3/2 overflow-hidden bg-linen">
                      <Media
                        src={item.image.src}
                        alt={item.image.alt}
                        sizes="(min-width: 768px) 47vw, 92vw"
                        className="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-105"
                      />
                    </div>
                    <p className="label mt-5 text-bronze-ink">{item.category}</p>
                    <h3 className="display mt-2 text-xl leading-snug">{item.title}</h3>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
