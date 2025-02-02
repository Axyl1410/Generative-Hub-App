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

  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  crossOrigin: "anonymous",
  reactStrictMode: true,
};

export default nextConfig;
