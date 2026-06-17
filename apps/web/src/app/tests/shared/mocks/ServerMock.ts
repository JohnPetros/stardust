import type { APIResponse, Page } from '@playwright/test'

import type { ServerMockRoute } from '../types/ServerMockRoute'

const SERVER_MOCK_ROUTE = '/api/tests/server'

type ServerMockController = {
  register: (routes: ServerMockRoute[]) => Promise<void>
  reset: () => Promise<void>
  registerSuccessDefaults: (overrides?: ServerMockRoute[]) => Promise<void>
}

export function ServerMock(page: Page): ServerMockController {
  function mergeRoutes(defaultRoutes: ServerMockRoute[], overrides: ServerMockRoute[]) {
    const routes = [...defaultRoutes]

    for (const override of overrides) {
      const routeIndex = routes.findIndex((route) => {
        return (
          route.method === override.method &&
          route.path === override.path &&
          JSON.stringify(route.query ?? {}) === JSON.stringify(override.query ?? {})
        )
      })

      if (routeIndex === -1) {
        routes.push(override)
        continue
      }

      routes[routeIndex] = override
    }

    return routes
  }

  async function assertResponseOk(response: APIResponse, action: string) {
    if (response.ok()) return

    throw new Error(`${action} failed: ${response.status()} ${await response.text()}`)
  }

  return {
    async register(routes) {
      const response = await page.request.put(SERVER_MOCK_ROUTE, {
        data: { routes },
      })

      await assertResponseOk(response, 'ServerMock.register')
    },

    async reset() {
      const response = await page.request.delete(SERVER_MOCK_ROUTE)

      await assertResponseOk(response, 'ServerMock.reset')
    },

    async registerSuccessDefaults(overrides = []) {
      const defaultRoutes: ServerMockRoute[] = [
        {
          method: 'GET',
          path: '/auth/account',
          status: 200,
          body: null,
        },
        {
          method: 'GET',
          path: '/profile/users/verify-name-in-use',
          status: 200,
          body: null,
        },
        {
          method: 'GET',
          path: '/profile/users/verify-email-in-use',
          status: 200,
          body: null,
        },
        {
          method: 'POST',
          path: '/auth/sign-up',
          status: 200,
          body: null,
        },
      ]

      await this.register(mergeRoutes(defaultRoutes, overrides))
    },
  }
}
