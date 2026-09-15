"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Looping background footage with a still underneath.
 *
 * The still is the real content: it is a priority image, it is what paints
 * first, and it is what stays if the footage never arrives. The video is an
 * enhancement layered over it, and it is treated as optional throughout —
 * a refused autoplay, reduced motion, a metered connection and an offscreen
 * hero all resolve to "just show the still".
 *
 * On a phone that matters more than it looks. The footage is several
 * megabytes; loading it eagerly would put it in front of the poster on the
 * same connection, so the hero would paint *later* on mobile than it does on
 * a desktop. The source is therefore attached after mount, off the critical
 * path, and only once the hero is actually on screen.
 */
export function LoopingVideo({
  src,
  poster,
  alt = "",
  priority,
}: {
  src: string;
  poster: string;
  /** Describe the still; the video itself is decorative. */
  alt?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Metered or slow connections keep the still and never fetch the file.
       Non-standard API, hence the cast and the optional chaining. */
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const frugal =
      connection?.saveData === true ||
      /^(slow-)?2g$/.test(connection?.effectiveType ?? "") ||
      connection?.effectiveType === "3g";

    if (frugal) {
      video.hidden = true;
      return;
    }

    let loaded = false;
    const attach = () => {
      if (loaded || motion.matches) return;
      loaded = true;
      /* Setting src rather than shipping a <source> is what keeps the file
         off the initial page load. */
      video.src = src;
      video.load();
    };

    const sync = () => {
      if (motion.matches) {
        video.pause();
        video.hidden = true;
        return;
      }
      video.hidden = false;
      attach();
      void video.play().catch(() => {});
    };

    /* Only load once the hero is in view, and stop playback when it leaves —
       decoding video that nobody is looking at costs battery and heat. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) sync();
        else video.pause();
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!motion.matches && loaded) void video.play().catch(() => {});
    };

    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Fades in over the still once there are frames to show, so a slow
          connection degrades to a photograph instead of a black rectangle. */}
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 data-[playing]:opacity-100"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlaying={(event) => {
          event.currentTarget.dataset.playing = "";
        }}
      />
    </>
  );
}
