import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Removed for dynamic server (API Routes + DB)
  trailingSlash: true,
  images: {
    // unoptimized: true, // Not required for Node server, but keep if user wants to save bandwidth or uses external loader? 
    // Actually, stick to default or let standard optimization work.
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
