import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  crossOrigin: "anonymous",
  reactStrictMode: true,
};

export default nextConfig;
