import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/install.html",
        destination: "/install",
        permanent: true,
      },
      {
        source: "/terms.html",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy.html",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
