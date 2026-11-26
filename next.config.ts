import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists higher up the tree).
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Admin image uploads are capped at 5 MB in the upload action itself.
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
