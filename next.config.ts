import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: 'api.builder.io',
      },
      {
        protocol: 'https',
        hostname: 'l9fbwpjd1wjrlkzf.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
