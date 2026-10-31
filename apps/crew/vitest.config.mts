import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

const integrationTests = [
  'src/controllers/tests/**/*.test.ts',
  'src/mastra/agents/*/controllers/tests/**/*.test.ts',
]

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
  test: {
    globals: true,
    root: './',
    env: {
      CREW_ENV: 'dev',
      CREW_DATABASE_URL: 'postgres://crew:crew@localhost:5433/crew',
      ANTHROPIC_API_KEY: 'test-anthropic-key',
      COMPOSIO_API_KEY: 'test-composio-key',
      PR_REVIEWER_API_KEY: 'test-pr-reviewer-key-with-at-least-32-chars',
      COMPOSIO_USER_ID: 'test-composio-user',
      COMPOSIO_GITHUB_CONNECTED_ACCOUNT_ID: 'test-connected-account',
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          exclude: [
            '**/node_modules/**',
            'src/mastra/agents/*/tests/**',
            ...integrationTests,
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: integrationTests,
          fileParallelism: false,
          hookTimeout: 180_000,
          testTimeout: 60_000,
        },
      },
    ],
  },
})
