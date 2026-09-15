import manifest from "./generated/image-manifest.json";

export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL: string;
}

const map = manifest as Record<string, ImageMeta>;

/**
 * Dimensions and LQIP for a prepared image. Falling back to a 3:2 frame keeps
 * layout stable if a path is added to the catalogue before the shoot is rerun.
 */
export function imageMeta(src: string): ImageMeta {
  return map[src] ?? { width: 1600, height: 1067, blurDataURL: "" };
}
