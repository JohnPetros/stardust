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
  swcMinify: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Código para verificar as configurações de otimização.
    // Ao executar, o webpack atualmente usa duas funções anônimas, que com
    // certeza não são funções do Terser.
    // console.log('config.optimization', config.optimization);
    // for (const eachMinimizer of config.optimization.minimizer) {
    //   console.log(eachMinimizer, eachMinimizer.name);
    // }

    config.optimization.minimizer = [];
    
    // TODO: Configurar o Terser para fazer minificação seletiva de fontes e bibliotecas,
    // conforme solução abaixo em comentário.
    
    // // Handle Terser minification (webpack's default)
    // const terser = config.optimization.minimizer.find((plugin) => plugin?.options?.terserOptions);
    // if (terser) {
    //   terser.options.terserOptions = {
    //     ...terser.options.terserOptions,
    //     keep_classnames: true,
    //     keep_fnames: true,
    //   };
    // }

    // // Handle all minification plugins
    // config.optimization.minimizer = config.optimization.minimizer.map((plugin) => {
    //   // Handle TerserPlugin
    //   if (plugin.constructor.name === 'TerserPlugin') {
    //     return {
    //       ...plugin,
    //       options: {
    //         ...plugin.options,
    //         terserOptions: {
    //           ...plugin.options.terserOptions,
    //           keep_classnames: true,
    //           keep_fnames: true,
    //         },
    //       },
    //     };
    //   }
      
    //   // Handle SWC minification if it's being used
    //   if (plugin.constructor.name === 'SwcMinifyPlugin') {
    //     return {
    //       ...plugin,
    //       options: {
    //         ...plugin.options,
    //         compress: {
    //           ...plugin.options.compress,
    //           keep_classnames: true,
    //           keep_fnames: true,
    //         },
    //         mangle: {
    //           ...plugin.options.mangle,
    //           keep_classnames: true,
    //           keep_fnames: true,
    //         },
    //       },
    //     };
    //   }
      
    //   return plugin;
    // });

    // // Exclude delegua package from minification
    // config.optimization.minimizer = config.optimization.minimizer.map((plugin) => {
    //   if (plugin.constructor.name === 'TerserPlugin' && plugin.options.exclude) {
    //     plugin.options.exclude = [
    //       ...plugin.options.exclude,
    //       /node_modules[/\\]delegua[/\\]/,
    //     ];
    //   } else if (plugin.constructor.name === 'TerserPlugin') {
    //     plugin.options.exclude = [/node_modules[/\\]delegua[/\\]/];
    //   }
    //   return plugin;
    // });

    return config;
  },
}

module.exports = nextConfig