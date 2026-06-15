import { config as loadEnv } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'

loadEnv({ path: '.env.testing' })

const baseURL = 'http://127.0.0.1:3100'

process.env.MODE = 'testing'
process.env.PORT = '3100'
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1'
process.env.NEXT_PUBLIC_STARDUST_WEB_URL = baseURL
process.env.NEXT_PUBLIC_STARDUST_SERVER_URL = `${baseURL}/api/tests/server`

export default defineConfig({
  testDir: './src/app/tests',
  testMatch: '**/*.test.ts',
  tsconfig: './tsconfig.playwright.json',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
  webServer: {
    command:
      'cross-env MODE=testing PORT=3100 NEXT_IGNORE_INCORRECT_LOCKFILE=1 NEXT_PUBLIC_STARDUST_WEB_URL=http://127.0.0.1:3100 NEXT_PUBLIC_STARDUST_SERVER_URL=http://127.0.0.1:3100/api/tests/server next dev --hostname 127.0.0.1 --port 3100',
    url: `${baseURL}/api/tests/server`,
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  },
})
