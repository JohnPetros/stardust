import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src'],
  outDir: 'build',
  shims: true,
  skipNodeModulesBundle: true,
  dts: true,
  clean: true,
})
