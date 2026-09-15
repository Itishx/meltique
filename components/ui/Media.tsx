import Image from "next/image";
import { imageMeta } from "@/lib/image";

interface MediaProps {
  src: string;
  alt: string;
  /** Responsive hint. Always pass one — it drives the srcset choice. */
  sizes: string;
  className?: string;
  /** Set on the LCP image only. */
  priority?: boolean;
  quality?: 70 | 82 | 92;
}

/**
 * An image from the prepared library.
 *
 * Dimensions and the blur placeholder come from the build-time manifest, so
 * every frame reserves its own space and fades in from a tonal LQIP rather
 * than a blank rectangle.
 */
export function Media({ src, alt, sizes, className, priority, quality = 82 }: MediaProps) {
  const meta = imageMeta(src);

  return (
    <Image
      src={src}
      alt={alt}
      width={meta.width}
      height={meta.height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={className}
      {...(meta.blurDataURL
        ? { placeholder: "blur" as const, blurDataURL: meta.blurDataURL }
        : {})}
    />
  );
}
