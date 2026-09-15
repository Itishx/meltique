"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Media } from "@/components/ui/Media";

/**
 * The four flavours as a rail rather than a grid.
 *
 * On a wide screen the section pins and the track travels sideways as the
 * page scrolls down, so the cards arrive one at a time from the right. The
 * vertical distance is derived from the actual track width, which keeps the
 * mapping one-to-one: a pixel of scroll is a pixel of travel, so it never
 * feels geared up or sluggish however many cards there are.
 *
 * Narrow screens get a plain swipeable, snapping row instead. Pinning a
 * section on a phone hijacks the only gesture the reader has.
 */
export function FlavourRail({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const wide = window.matchMedia("(min-width: 64rem)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;
    let frame = 0;

    const paint = () => {
      if (distance <= 0) return;
      const travelled = window.scrollY - section.offsetTop;
      const progress = Math.min(1, Math.max(0, travelled / distance));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const measure = () => {
      /* Below the breakpoint, or with motion turned down, hand everything
         back to the browser: no imposed height, no transform, native
         horizontal scrolling. */
      if (!wide.matches || still.matches) {
        distance = 0;
        section.style.height = "";
        track.style.transform = "";
        if (progressRef.current) progressRef.current.style.transform = "";
        return;
      }
      track.style.transform = "";
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      paint();
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    measure();
    /* Fonts and images landing late change the track width. */
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", measure);
    still.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", measure);
      still.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative border-y border-rule">
      <div /* The padding is the fixed header: without it the cards centre on the
             viewport and read as sitting too high, since the header covers the
             top 6rem of that space. */
        className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden lg:pt-24">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-8 lg:overflow-visible lg:px-10 lg:py-0 lg:will-change-transform xl:px-16"
        >
          {products.map((product, index) => (
            <article
              key={product.slug}
              className="flex w-[80vw] shrink-0 snap-center flex-col sm:w-[62vw] md:w-[46vw] lg:w-auto lg:flex-row lg:items-stretch"
            >
              {/* The posters are 2:3. The frame is driven off the viewport
                  height at that exact ratio, so the card is as tall as the
                  pinned section allows and the image is never cropped. */}
              <Link
                href={`/product/${product.slug}`}
                className="group relative block shrink-0 overflow-hidden"
                style={{ backgroundColor: product.poster?.ground ?? product.backdrop }}
              >
                <div className="relative aspect-2/3 w-full lg:h-[66svh] lg:w-auto">
                  <Media
                    src={product.poster?.src ?? product.images[0].src}
                    alt={product.poster?.alt ?? product.images[0].alt}
                    sizes="(min-width: 64rem) 44vh, (min-width: 48rem) 46vw, 80vw"
                    priority={index < 2}
                    quality={92}
                    className="size-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="label absolute left-5 top-5 bg-paper px-3 py-1.5 text-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>

              {/* Copy sits beside the poster on a wide screen, under it on a
                  narrow one. Beside is what keeps the card short enough to
                  pin while the image stays large. */}
              <div className="flex flex-1 flex-col pt-7 lg:w-[21rem] lg:shrink-0 lg:justify-end lg:pl-8 lg:pt-0 xl:w-[24rem] xl:pl-10">
                <h3 className="display text-[2rem] leading-[1.05] xl:text-[2.6rem]">
                  <Link href={`/product/${product.slug}`} className="hover:opacity-70">
                    {product.name}
                  </Link>
                </h3>
                <p className="display mt-3 text-xl italic text-gold">
                  {product.tagline}
                </p>

                <p className="mt-6 text-base leading-relaxed text-muted">
                  {product.inside}
                </p>

                <dl className="mt-6">
                  <dt className="label text-muted">Notes</dt>
                  <dd className="mt-2 text-sm leading-relaxed">
                    {product.sensoryNotes.join(" · ")}
                  </dd>
                </dl>

                <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-rule pt-6">
                  <span className="display text-2xl tabular-nums">
                    {formatPrice(product.priceInPaise)}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="label link-draw text-gold"
                  >
                    View this box
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Travel indicator: the only cue that the section is pinned. */}
        <div className="gutter mt-10 hidden lg:block">
          <div className="h-px w-full bg-rule">
            <div
              ref={progressRef}
              className="h-px origin-left scale-x-0 bg-gold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
