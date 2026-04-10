import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {remotePatterns: [
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
                port: '',
                pathname: '/**',
            },
            {protocol: 'https', hostname: '8esumdn3fz1zavfy.public.blob.vercel-storage.com'}
        ]}
};

export default nextConfig;
