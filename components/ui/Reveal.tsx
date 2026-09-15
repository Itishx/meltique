"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** `fade` settles content upward; `image` wipes a frame open. */
  variant?: "fade" | "image";
  /** Stagger, in milliseconds. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Reveals content once, when it first enters the viewport.
 *
 * The initial hidden state lives in CSS via the `data-reveal` attribute, so
 * server-rendered markup is already styled and there is no flash. Readers with
 * reduced-motion preferences get the finished state immediately, and the
 * `.no-js` fallback in globals.css covers scripting being unavailable.
 */
export function Reveal({
  children,
  variant = "fade",
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const attribute = variant === "image" ? "data-reveal-image" : "data-reveal";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute(attribute, "shown");
      return;
    }

    const show = () => node.setAttribute(attribute, "shown");

    /**
     * A safety net. The animation must never decide whether content exists:
     * if the observer has not fired by now — no support, a suppressed
     * rendering lifecycle, a scroll we missed — show it anyway.
     */
    const fallback = window.setTimeout(show, 2000);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [attribute]);

  const props = {
    ref,
    className,
    [attribute]: "",
    style: delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined,
  };

  return <Tag {...props}>{children}</Tag>;
}
