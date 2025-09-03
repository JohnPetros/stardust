/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
    optimizePackageImports: ['@phosphor-icons/react/dist/ssr'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_CDN_HOST || 'localhost',
        port: '',
        pathname: process.env.NEXT_PUBLIC_SUPABASE_CDN_PATH || '/',
      },
    ],
  },
  output: 'standalone',
  webpack: (config) => {
    config.optimization.minimizer = [];
    return config;
  },
}

module.exports = nextConfig