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
  // Use stable Turbopack API
  turbopack: {
    resolveAlias: {
      "@repo/design-system": "../../packages/design-system",
    },
  },
  experimental: {
    // Improve CSS hot reloading
    optimizePackageImports: ['@repo/design-system', '@repo/ui'],
    webpackBuildWorker: true,
  },
  webpack: (config) => {
    // Force webpack to include CSS files in the watch list
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules\/(?!@repo)/,
      poll: 1000, // Check for changes every second
    };
    return config;
  },
  output: "export",
};

export default nextConfig;
