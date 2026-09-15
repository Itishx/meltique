import Link from "next/link";

import { clsx } from "@/lib/clsx";
import { formatPrice } from "@/lib/format";
import { fromPriceInPaise } from "@/lib/products";
import type { Product } from "@/lib/types";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { Media } from "@/components/ui/Media";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/site/Wordmark";

/** Frames sit inside a ruled grid rather than bleeding to the page edge. */
function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("px-8 py-9 sm:px-10 sm:py-10 lg:px-12", className)}>{children}</div>;
}

/**
 * A picture cell. Frames match their source ratio so nothing is cropped, and
 * an optional `video` plays in place with the image as its still.
 */
function Frame({
  src,
  alt,
  aspect,
  video,
  parallax,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  aspect: string;
  video?: string;
  parallax?: boolean;
  className?: string;
  sizes: string;
}) {
  if (video) {
    return (
      <div className={clsx("relative w-full overflow-hidden bg-deep", aspect, className)}>
        <LoopingVideo src={video} poster={src} alt={alt} />
      </div>
    );
  }
  if (parallax) {
    return (
      <ParallaxMedia
        src={src}
        alt={alt}
        sizes={sizes}
        quality={92}
        strength={6}
        className={clsx("w-full bg-deep", aspect, className)}
      />
    );
  }
  return (
    <div className={clsx("relative w-full overflow-hidden bg-deep", aspect, className)}>
      <Media src={src} alt={alt} sizes={sizes} quality={92} className="size-full object-cover" />
    </div>
  );
}

/**
 * The cube, the Box of 4 and the material story as one ruled grid.
 *
 * Three stacked full-bleed blocks read as very heavy; holding them inside a
 * single bordered frame lets the page breathe at the edges and lets hairlines
 * do the dividing instead of sheer mass.
 */
export function StoryGrid({
  boxOfFour,
  flavours,
}: {
  boxOfFour?: Product;
  flavours: Product[];
}) {
  return (
    <section className="bg-paper pb-12 pt-20 md:pb-16 md:pt-28" aria-labelledby="the-cube">
      <div className="gutter">
        <div className="border border-rule">
          {/* ------------------------------------------------ the cube */}
          <Reveal>
            <Cell className="border-b border-rule text-center">
              <p className="label text-gold">02 · The form</p>
              <h2 id="the-cube" className="display mt-5 text-display-md lg:text-display-lg">
                The <Wordmark size="xl" className="shimmer align-baseline" /> Cube.
              </h2>
              <p className="mx-auto mt-5 max-w-[68ch] text-base text-balance text-muted">
                We like symmetry. So every flavour takes the same shape, the
                same size, and the same M, pressed into the top face by the
                mould itself rather than printed on a label.
              </p>
            </Cell>
          </Reveal>

          <Reveal variant="image">
            <Frame
              src="/images/editorial/made-to-melt.jpg"
              alt="All four MELTYK cubes melting together, dark, caramel crunch, fruit and nut, and protein, each embossed with an M and spilling its own filling"
              aspect="aspect-16/9"
              sizes="(min-width: 80rem) 80vw, 92vw"
              parallax
              className="border-b border-rule"
            />
          </Reveal>

          {/* ------------------------------- the box of 4 · the material
           * Two columns, each a picture with its own copy directly beneath —
           * the same reading order as the flavour wall.
           */}
          <div className="grid lg:grid-cols-2">
            {boxOfFour ? (
              <div className="flex flex-col border-b border-rule lg:border-b-0 lg:border-r">
                <Reveal variant="image">
                  <Frame
                    src={boxOfFour.images[0].src}
                    alt={boxOfFour.images[0].alt}
                    aspect="aspect-4/3"
                    sizes="(min-width: 64rem) 46vw, 92vw"
                    className="border-b border-rule"
                  />
                </Reveal>

                <Reveal className="flex-1">
                  <Cell className="flex h-full flex-col">
                    <p className="label text-gold">03 · The box</p>
                    <h3 className="display mt-5 text-display-md">Four to a box.</h3>
                    <p className="mt-5 max-w-[58ch] text-base text-muted">
                      The same instinct, applied to the packaging. We wanted the
                      range to stay consistent, so there is one size and one
                      count: four cubes, every time, in a fitted tray.
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                      {flavours.map((flavour) => (
                        <li key={flavour.slug} className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
                            style={{ backgroundColor: flavour.swatch }}
                          />
                          <span className="label text-muted">{flavour.name}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-7 text-sm tabular-nums">
                      From {formatPrice(fromPriceInPaise)}
                      <span className="ml-3 text-muted">4 cubes</span>
                    </p>

                    <Link
                      href="/shop"
                      className="label mt-8 inline-flex h-12 w-fit items-center bg-gold px-8 pt-px text-espresso transition-colors duration-300 hover:bg-on-dark"
                    >
                      See the boxes
                    </Link>
                  </Cell>
                </Reveal>
              </div>
            ) : null}

            <div className="flex flex-col">
              <Reveal variant="image">
                <Frame
                  src="/images/editorial/material-panel.jpg"
                  alt="A MELTYK cube in raking light, the embossed M cut into its top face, chocolate shards scattered around it"
                  aspect="aspect-4/3"
                  sizes="(min-width: 64rem) 46vw, 92vw"
                  className="border-b border-rule"
                />
              </Reveal>

              <Reveal className="flex-1">
                <Cell className="flex h-full flex-col">
                  <p className="label text-gold">The feel</p>
                  <h3 id="material" className="display mt-5 text-display-md">
                    Chocolate, made to be felt.
                  </h3>
                  <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">
                    A cube is a shape you can hold without it breaking.
                    Everything about the format is built around one moment: the
                    second before it melts.
                  </p>
                </Cell>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
