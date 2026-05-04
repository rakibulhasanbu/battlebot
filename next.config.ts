import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3', 'playwright-core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.battlebots.com' },
      { protocol: 'https', hostname: 'battlebots.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'b.thumbs.redditmedia.com' },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
