import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    nodePolyfills({
      include: ['process'],
    }),
  ],
  build: {
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
