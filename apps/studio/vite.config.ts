import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  resolve: {
    alias: {
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    },
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    nodePolyfills(),
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
})
