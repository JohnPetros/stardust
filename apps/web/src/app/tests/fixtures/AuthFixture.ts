import type { BrowserContext } from '@playwright/test'

const ACCESS_TOKEN_COOKIE = '@stardust:access-token'
const REFRESH_TOKEN_COOKIE = '@stardust:refresh-token'
const SHOULD_RESET_PASSWORD_COOKIE = '@stardust:should-reset-password'

type SessionCookies = {
  accessToken: string
  refreshToken?: string
  shouldResetPassword?: string
}

export class AuthFixture {
  constructor(private readonly context: BrowserContext) {}

  async authenticate(accessToken = 'web-e2e-test-token') {
    await this.context.addCookies([
      {
        name: ACCESS_TOKEN_COOKIE,
        value: accessToken,
        domain: '127.0.0.1',
        path: '/',
      },
    ])
  }

  async setSessionCookies(cookies: SessionCookies) {
    await this.context.addCookies([
      {
        name: ACCESS_TOKEN_COOKIE,
        value: cookies.accessToken,
        domain: '127.0.0.1',
        path: '/',
      },
      ...(cookies.refreshToken
        ? [
            {
              name: REFRESH_TOKEN_COOKIE,
              value: cookies.refreshToken,
              domain: '127.0.0.1',
              path: '/',
            },
          ]
        : []),
      ...(cookies.shouldResetPassword
        ? [
            {
              name: SHOULD_RESET_PASSWORD_COOKIE,
              value: cookies.shouldResetPassword,
              domain: '127.0.0.1',
              path: '/',
            },
          ]
        : []),
    ])
  }

  clear() {
    return this.context.clearCookies()
  }
}
