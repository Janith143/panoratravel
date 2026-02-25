import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Removed for dynamic server (API Routes + DB)
  trailingSlash: true,
  images: {
    unoptimized: true, // Disabling optimization to prevent 400 errors with dynamically uploaded files on VPS
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
