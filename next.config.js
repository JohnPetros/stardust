
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aukqejqsiqsqowafpppb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  swcMinify: true,
  // transpilePackages: [
  //   '@react-email/components',
  //   '@react-email/render',
  //   '@react-email/html',
  //   '@react-email/tailwind',
  // ],
}

module.exports = nextConfig
