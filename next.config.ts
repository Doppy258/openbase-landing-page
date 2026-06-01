import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this project — prevents scanning parent directories
  // (e.g. ~/Documents) when another lockfile exists nearby.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
