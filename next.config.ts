import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — no backend. Product images are pre-optimised to WebP by scripts/ingest.mjs.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
