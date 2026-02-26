import type { NextConfig } from "next";

// Force reload on schema change

// Forced reload: 2026-02-15T19:29:18+07:00

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fix for native binary canvas packages crashing Vercel Serverless deployment
  serverExternalPackages: ['canvas', '@napi-rs/canvas'],
  // Fix for Next.js 16 Turbopack conflict with next-pwa
  // Removed explicit turbopack config to prevent panic

  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
    // serverActions: true, // Enabled by default in Next.js 14
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
