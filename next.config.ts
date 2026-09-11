import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Surface hook-order/render bugs during development instead of in production.
  reactStrictMode: true,
  async rewrites() {
    // Same-origin proxy to the SUTU backend (avoids unconfigured CORS).
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://sutu.tixrouter.my.id/api/v1/:path*",
      },
      {
        source: "/health",
        destination: "https://sutu.tixrouter.my.id/health",
      },
    ];
  },
};

export default nextConfig;
