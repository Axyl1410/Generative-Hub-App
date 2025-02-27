import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
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

export default withNextIntl(nextConfig);
