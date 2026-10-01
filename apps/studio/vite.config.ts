import { reactRouter } from '@react-router/dev/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { parseEnv } from './src/constants/envSchema'

export default defineConfig(({ mode }) => {
  try {
    parseEnv(loadEnv(mode, process.cwd(), ''))
  } catch (error) {
    throw new Error(
      `Invalid Studio environment for mode "${mode}". Check VITE_SERVER_APP_URL, VITE_CDN_URL and VITE_WEB_APP_URL.\n${error}`,
    )
  }

  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      ...nodePolyfills({ exclude: ['module', 'stream'] }).map((plugin) => ({
        ...plugin,
        applyToEnvironment: (environment: { name: string }) =>
          environment.name === 'client',
      })),
    ],
    build: {
      target: 'es2022',
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.message.includes(
              "Error when using sourcemap for reporting an error: Can't resolve original location of error.",
            )
          ) {
            return
          }

          warn(warning)
        },
      },
    },
  }
})
