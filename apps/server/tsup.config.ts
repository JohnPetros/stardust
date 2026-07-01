import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => {
  return {
    entry: ['src/main.ts'],
    format: ['cjs'],
    clean: true,
    sourcemap: false,
    outDir: 'build',
    noExternal: [
      'ai',
      '@ai-sdk/google',
      '@ai-sdk/openai',
      '@ai-sdk/provider',
      '@ai-sdk/provider-utils',
    ],
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        '.toml': 'empty',
        '.sql': 'empty',
      }
    },
    ...options,
  }
})
