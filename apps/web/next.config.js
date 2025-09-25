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
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), usb=(), payment=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig