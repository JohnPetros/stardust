import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
  outDir: 'build',
  // external: ['zod', 'dayjs'],
})
