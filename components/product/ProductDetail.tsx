"use client";

import { useState } from "react";

import type { Product } from "@/lib/types";
import { clsx } from "@/lib/clsx";
import { Media } from "@/components/ui/Media";
import { BuyPanel } from "./BuyPanel";

/**
 * Gallery and buy panel, paired.
 *
 * The gallery is a thumbnail-driven single frame on desktop and a swipeable
 * rail on small screens, so the largest possible image is always on show.
 */
export function ProductDetail({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const active = product.images[index] ?? product.images[0];

  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-24">
      <div>
        {/* Desktop: one large frame, driven by thumbnails. */}
        <div className="relative hidden aspect-square overflow-hidden bg-linen lg:block">
          <Media
            key={active.src}
            src={active.src}
            alt={active.alt}
            sizes="(min-width: 1024px) 52vw, 100vw"
            quality={92}
            priority
            className="size-full object-cover"
          />
        </div>

        {/* Mobile: a snap rail, no controls needed. */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:hidden">
          {product.images.map((image, i) => (
            <li key={image.src} className="w-[86%] shrink-0 snap-center">
              <div className="relative aspect-square overflow-hidden bg-linen">
                <Media
                  src={image.src}
                  alt={image.alt}
                  sizes="86vw"
                  priority={i === 0}
                  className="size-full object-cover"
                />
              </div>
            </li>
          ))}
        </ul>

        {product.images.length > 1 ? (
          <ul className="mt-3 hidden gap-3 lg:flex">
            {product.images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}: ${image.alt}`}
                  aria-current={i === index}
                  className={clsx(
                    "relative block aspect-square w-20 overflow-hidden bg-linen transition-opacity duration-300",
                    i === index ? "opacity-100" : "opacity-55 hover:opacity-85",
                  )}
                >
                  <Media
                    src={image.src}
                    alt=""
                    sizes="80px"
                    quality={70}
                    className="size-full object-cover"
                  />
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-0 bottom-0 h-px bg-ink transition-transform duration-500",
                      i === index ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="lg:pt-2">
        <BuyPanel product={product} />
      </div>
    </div>
  );
}
