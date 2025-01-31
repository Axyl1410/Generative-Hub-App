import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
