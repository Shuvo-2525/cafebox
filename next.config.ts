import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all for now as WooCommerce URLs vary
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  },
};

export default nextConfig;
