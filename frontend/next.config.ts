import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-ems",
  // Allow the LAN address printed by `next dev` to load development assets.
  allowedDevOrigins: ["192.168.1.3"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
