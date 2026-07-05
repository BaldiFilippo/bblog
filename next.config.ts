import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF, fallback to WebP — browser picks best supported format
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    // Widths used for srcset generation
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [96, 192, 256, 384, 512],
  },
};

export default nextConfig;
