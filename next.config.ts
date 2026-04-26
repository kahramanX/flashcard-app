import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external IPs to connect and prevent host checking issues in dev
  serverExternalPackages: [],
  experimental: {
    // Allows accessing dev server from local network without host mismatch errors
    allowedRevalidateHeaderKeys: [],
  },
  // In Next.js 15+, sometimes you need to configure CORS or similar if fetching fails,
  // but for same-origin dev server, we should make sure React Server Components don't block it.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;
