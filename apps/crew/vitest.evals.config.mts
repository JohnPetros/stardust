import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
  test: {
    globals: true,
    root: './',
    include: ['src/mastra/agents/*/tests/**/*.test.ts'],
    env: {
      CREW_ENV: 'dev',
      CREW_DATABASE_URL: 'postgres://crew:crew@localhost:5433/crew',
      PR_REVIEWER_API_KEY: 'test-pr-reviewer-key-with-at-least-32-chars',
    },
    setupFiles: ['./src/tests/load-eval-env.ts', '@mastra/evals/vitest/setup'],
    testTimeout: 1_200_000,
    disableConsoleIntercept: true,
  },
})
