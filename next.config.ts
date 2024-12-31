import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com`,
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
