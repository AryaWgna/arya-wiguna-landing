import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static portfolio: no API routes, no image optimization needed for local assets.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
