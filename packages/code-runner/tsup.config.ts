import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  outDir: 'build',
})
