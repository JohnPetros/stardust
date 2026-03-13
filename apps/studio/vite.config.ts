import { reactRouter } from '@react-router/dev/vite'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import EnvironmentPlugin from 'vite-plugin-environment'

const plugins = [
  tailwindcss(),
  reactRouter(),
  tsconfigPaths(),
  nodePolyfills({
    include: ['process'],
  }),
  EnvironmentPlugin('all'),
] as unknown as PluginOption[]

export default defineConfig({
  plugins,
})
