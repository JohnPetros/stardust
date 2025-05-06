/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: process.env.NEXT_PUBLIC_SUPABASE_CDN_HOST,
        port: '',
        pathname: process.env.NEXT_PUBLIC_SUPABASE_CDN_PATH,
      },
    ],
  },
  swcMinify: true,
  output: 'standalone'
}

module.exports = nextConfig
