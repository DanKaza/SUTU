import type { NextConfig } from "next";

/**
 * Backend origin, overridable so a redeployment or a moved host is a one-line
 * env change rather than a code edit in two places (here and lib/api/client.ts).
 *
 * `sutu.tixrouter.my.id` is retired — it no longer answers (docs/backend.md
 * §8 kept a "backend tidak terjangkau" note for it). The live host is the
 * Cloudflare tunnel in docs/implementation_backend.md.
 */
const API_ORIGIN = process.env.NEXT_PUBLIC_SUTU_API_ORIGIN ?? "https://sutu.rynaqrtz.my.id";

const nextConfig: NextConfig = {
  // Surface hook-order/render bugs during development instead of in production.
  reactStrictMode: true,
  async rewrites() {
    // Same-origin proxy to the SUTU backend (avoids unconfigured CORS).
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_ORIGIN}/api/v1/:path*`,
      },
      {
        source: "/health",
        destination: `${API_ORIGIN}/health`,
      },
    ];
  },
};

export default nextConfig;
