import type { NextConfig } from "next";

// Fonts and cover media never change under the same name: cache them for a year
const IMMUTABLE = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const SECURITY = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY },
      { source: "/images/:path*", headers: IMMUTABLE },
      { source: "/fonts/:path*", headers: IMMUTABLE },
    ];
  },
};

export default nextConfig;
