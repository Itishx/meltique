import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct, getRelated, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { priceOf } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { ProductWall } from "@/components/product/ProductWall";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.tagline} ${product.story[0]}`.slice(0, 155),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} · ${site.name}`,
      description: product.tagline,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelated(product, 3);

  /* Product schema, so listings carry price and availability. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: product.images.map((image) => new URL(image.src, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    weight: product.weight,
    offers: {
      "@type": "Offer",
      price: (priceOf(product).now / 100).toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: new URL(`/product/${product.slug}`, site.url).toString(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="gutter pb-24 pt-28 md:pt-36">
        <nav aria-label="Breadcrumb" className="label mb-10 text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="link-draw">
                Meltyk
              </Link>
            </li>
            <li aria-hidden className="opacity-40">
              /
            </li>
            <li>
              <Link href="/shop" className="link-draw">
                Shop
              </Link>
            </li>
            <li aria-hidden className="opacity-40">
              /
            </li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <header className="mb-10 max-w-5xl">
          <p className="label text-gold">Box of 4</p>
          <h1 className="display mt-4 text-display-xl">{product.name}</h1>
          <p className="display mt-3 text-display-sm italic text-bronze-ink">
            {product.tagline}
          </p>
        </header>

        <ProductDetail product={product} />

        {/* ------------------------------------------------------------ story */}
        <section className="mt-24 grid gap-12 border-t border-rule pt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="display text-display-md">The making</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-5">
            {product.story.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </section>

        {/* ------------------------------------------------------- specification */}
        <section className="mt-20 border-t border-rule pt-16" aria-labelledby="spec">
          <Reveal>
            <h2 id="spec" className="display text-display-md">
              Specification
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <Spec title="Ingredients" items={product.ingredients} />
            <Spec title="Materials" items={product.materials} />
            <Spec
              title="Dietary"
              items={[...product.dietary, ...product.allergens]}
            />
            <div>
              <h3 className="label text-muted">Keeping</h3>
              <p className="mt-4 text-sm leading-relaxed">{product.storage}</p>
              <h3 className="label mt-8 text-muted">Size</h3>
              <p className="mt-4 text-sm">
                {product.weight}
              </p>
              <h3 className="label mt-8 text-muted">Price</h3>
              <p className="mt-4 text-sm tabular-nums">
                {formatPrice(priceOf(product).now)}
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- related */}
        {related.length ? (
          <section className="mt-24 border-t border-rule pt-16" aria-labelledby="related">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related" className="display text-display-md">
                Also consider
              </h2>
              <Link href="/shop" className="label link-draw">
                All chocolate
              </Link>
            </Reveal>

            <div className="mt-12">
              <ProductWall products={related} tone="dark" imageAspect="aspect-2/3" columns={3} />
            </div>
          </section>
        ) : null}
      </div>

      {/* Closing frame — the product back in its world. */}
      <section className="relative aspect-16/10 overflow-hidden bg-cocoa md:aspect-21/9">
        <Media
          src={product.images[product.images.length - 1].src}
          alt={product.images[product.images.length - 1].alt}
          sizes="100vw"
          className="size-full object-cover"
        />
      </section>
    </>
  );
}

function Spec({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="label text-muted">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
