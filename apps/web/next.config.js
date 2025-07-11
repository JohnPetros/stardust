// See: https://kentcdodds.com/blog/profile-a-react-app-for-performance#build-and-measure-the-production-app
// See: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config

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
  // swcMinify: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Opção 1 para desabilitar minificação.
    // config.optimization.minimizer = [];

    // Opção 2: Achar o terser e desligar algumas coisas.
    const terser = config.optimization.minimizer.find((plugin) => plugin?.options?.terserOptions);

    if (terser) {
      console.log('Terser localizado', terser);
      terser.options.terserOptions = {
        ...terser.options.terserOptions,
        keep_classnames: true,
        keep_fnames: true,
      };
    }
    return config;
  },
}

module.exports = nextConfig