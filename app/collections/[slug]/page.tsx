import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { collectionProducts, collections, getCollection } from "@/lib/collections";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { ProductWall } from "@/components/product/ProductWall";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return {
    title: `${collection.name} collection`,
    description: collection.intro,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} · Meltyk`,
      description: collection.intro,
      images: [{ url: collection.image.src, alt: collection.image.alt }],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = collectionProducts(collection);
  const next = collections.find((c) => c.order === (collection.order % collections.length) + 1);

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden bg-espresso text-on-dark">
        <Media
          src={collection.image.src}
          alt={collection.image.alt}
          sizes="100vw"
          quality={92}
          priority
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-espresso/25"
        />
        <div className="gutter relative flex min-h-[70svh] flex-col justify-end pb-16 pt-36">
          <p className="label text-gold">
            {String(collection.order).padStart(2, "0")} · {collection.kicker}
          </p>
          <h1 className="display mt-4 text-display-xl">{collection.name}</h1>
          <p className="mt-5 max-w-[64ch] text-base text-on-dark-muted">
            {collection.intro}
          </p>
        </div>
      </section>

      <div className="gutter py-20 md:py-28">
        <Reveal className="mx-auto max-w-5xl">
          <p className="display text-display-sm leading-relaxed text-balance">
            {collection.note}
          </p>
        </Reveal>

        <section className="mt-20 border-t border-rule pt-12" aria-labelledby="in-collection">
          <h2 id="in-collection" className="display text-display-md">
            In this collection
          </h2>

          <div className="mt-12">
              <ProductWall products={items} tone="dark" imageAspect="aspect-2/3" columns={3} />
            </div>
        </section>

        {next ? (
          <Reveal className="mt-24 border-t border-rule pt-10">
            <Link href={`/collections/${next.slug}`} className="group block">
              <p className="label text-muted">Next collection</p>
              <p className="display mt-3 text-display-md transition-colors group-hover:text-bronze-ink">
                {next.name} →
              </p>
            </Link>
          </Reveal>
        ) : null}
      </div>
    </>
  );
}
