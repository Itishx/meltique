import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The floating dev badge sits over the design; hide it while reviewing. */
  devIndicators: false,
  images: {
    // Editorial photography is served at a few deliberate qualities only.
    qualities: [70, 82, 92],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
