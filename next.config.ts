import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      
      {
        protocol: "https",
        hostname: "utils.io",
      },
    ],
  },
};

export default nextConfig;