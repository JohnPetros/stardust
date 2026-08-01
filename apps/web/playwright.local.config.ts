import { defineConfig } from '@playwright/test'

import baseConfig from './playwright.config'

const baseURL = 'http://127.0.0.1:3101'

export default defineConfig(baseConfig, {
  use: {
    ...baseConfig.use,
    baseURL,
  },
  webServer: {
    command:
      'cross-env MODE=testing PORT=3101 NEXT_IGNORE_INCORRECT_LOCKFILE=1 NEXT_PUBLIC_STARDUST_WEB_URL=http://127.0.0.1:3101 NEXT_PUBLIC_STARDUST_SERVER_URL=http://127.0.0.1:3101/api/tests/server next dev --hostname 127.0.0.1 --port 3101',
    url: `${baseURL}/api/tests/server`,
    reuseExistingServer: false,
    timeout: 300000,
  },
})
