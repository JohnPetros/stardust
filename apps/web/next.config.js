const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL
const cdnRemotePattern = cdnUrl
  ? {
      protocol: new URL(cdnUrl).protocol.replace(':', ''),
      hostname: new URL(cdnUrl).hostname,
      port: new URL(cdnUrl).port,
      pathname: `${new URL(cdnUrl).pathname.replace(/\/$/, '')}/**`,
    }
  : {
      protocol: 'https',
      hostname: 'localhost',
      port: '',
      pathname: '/',
    }

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
    remotePatterns: [cdnRemotePattern],
  },
  env: {
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },
  output: 'standalone',
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
