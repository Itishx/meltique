"use client";

import { useEffect, useRef } from "react";

import { clsx } from "@/lib/clsx";
import { Media } from "./Media";

/**
 * A frame whose picture drifts against the scroll.
 *
 * The image is rendered taller than its frame and slid within it, so the
 * overflow is always covered — there is no edge to catch. Reduced motion, or
 * no JavaScript, simply leaves it centred and still.
 */
export function ParallaxMedia({
  src,
  alt,
  className,
  sizes = "100vw",
  quality,
  /** Drift as a percentage of the frame height, each way. */
  strength = 8,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  quality?: 70 | 82 | 92;
  strength?: number;
  priority?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let ticking = 0;

    const update = () => {
      ticking = 0;
      const { top, height } = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (top > viewport || top + height < 0) return;

      /* 0 as the frame enters from the bottom, 1 as it leaves past the top. */
      const progress = (viewport - top) / (viewport + height);
      const shift = (progress - 0.5) * 2 * strength;
      inner.style.transform = `translate3d(0, ${shift.toFixed(3)}%, 0)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = window.requestAnimationFrame(update);
    };

    const sync = () => {
      if (motionOk.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
        inner.style.transform = "";
      }
    };

    sync();
    motionOk.addEventListener("change", sync);
    window.addEventListener("resize", onScroll);

    return () => {
      if (ticking) window.cancelAnimationFrame(ticking);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionOk.removeEventListener("change", sync);
    };
  }, [strength]);

  /* Extra height on each side gives the drift somewhere to go. */
  const overscan = strength + 4;

  return (
    <div ref={frameRef} className={clsx("relative overflow-hidden", className)}>
      <div
        ref={innerRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${overscan}%`, height: `${100 + overscan * 2}%` }}
      >
        <Media
          src={src}
          alt={alt}
          sizes={sizes}
          quality={quality}
          priority={priority}
          className="size-full object-cover"
        />
      </div>
    </div>
  );
}
