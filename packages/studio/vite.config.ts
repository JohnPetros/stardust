import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { scenesPlugin } from './vite-plugins/scenes'

export default defineConfig({
  plugins: [viteReact(), tailwindcss(), svgr(), scenesPlugin()],
  server: {
    port: 3030,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
