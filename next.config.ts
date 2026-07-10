import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'usjijpwcubtxofjqgiii.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.selar.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Optimize production builds
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Production source maps (disable for smaller bundles in production)
  productionBrowserSourceMaps: false,
  
  // Ensure environment variables are available to the browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
