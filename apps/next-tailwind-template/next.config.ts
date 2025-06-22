import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure Next.js to use the src directory
  distDir: ".next",
  experimental: {},
  output: "export",
};

export default nextConfig;
