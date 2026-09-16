import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The floating dev badge sits over the design; hide it while reviewing. */
  devIndicators: false,
  /* Classic Dark was renamed to Meltyk Muse after launch. The old URL was
     live and may already be in a share, a QR code or Google's index, so it
     redirects permanently rather than 404ing. */
  async redirects() {
    return [
      {
        source: "/product/classic-dark",
        destination: "/product/meltyk-muse",
        permanent: true,
      },
    ];
  },
  images: {
    // Editorial photography is served at a few deliberate qualities only.
    qualities: [70, 82, 92],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
