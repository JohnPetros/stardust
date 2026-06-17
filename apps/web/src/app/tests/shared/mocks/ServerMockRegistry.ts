import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import type { ServerMockRoute } from '../types/ServerMockRoute'

const SERVER_MOCK_ROUTES_FILE_PATH = '/tmp/stardust/stardust-web-server-mock-routes.json'

type FindServerMockRouteParams = {
  method: string
  path: string
  query: Record<string, string>
}

type ServerMockRegistry = {
  registerServerMockRoutes: (routes: ServerMockRoute[]) => void
  resetServerMockRoutes: () => void
  findServerMockRoute: (params: FindServerMockRouteParams) => ServerMockRoute | null
}

const ServerMockRegistry = (): ServerMockRegistry => {
  function normalizePath(path: string) {
    return path.startsWith('/') ? path : `/${path}`
  }

  function normalizeQuery(query?: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(query ?? {}).sort(([leftKey], [rightKey]) =>
        leftKey.localeCompare(rightKey),
      ),
    )
  }

  function getServerMockRoutesStore(): ServerMockRoute[] {
    if (!existsSync(SERVER_MOCK_ROUTES_FILE_PATH)) {
      return []
    }

    return JSON.parse(readFileSync(SERVER_MOCK_ROUTES_FILE_PATH, 'utf-8'))
  }

  return {
    registerServerMockRoutes(routes) {
      mkdirSync(dirname(SERVER_MOCK_ROUTES_FILE_PATH), { recursive: true })

      const normalizedRoutes = routes.map((route) => ({
        ...route,
        method: route.method.toUpperCase() as ServerMockRoute['method'],
        path: normalizePath(route.path),
        query: route.query ? normalizeQuery(route.query) : undefined,
        headers: route.headers ?? {},
      }))

      writeFileSync(
        SERVER_MOCK_ROUTES_FILE_PATH,
        JSON.stringify(normalizedRoutes),
        'utf-8',
      )
    },

    resetServerMockRoutes() {
      if (!existsSync(SERVER_MOCK_ROUTES_FILE_PATH)) {
        return
      }

      unlinkSync(SERVER_MOCK_ROUTES_FILE_PATH)
    },

    findServerMockRoute(params) {
      const routes = getServerMockRoutesStore()
      const normalizedMethod = params.method.toUpperCase()
      const normalizedPath = normalizePath(params.path)
      const normalizedQuery = normalizeQuery(params.query)

      return (
        routes.find((route) => {
          if (route.method !== normalizedMethod) return false
          if (route.path !== normalizedPath) return false

          if (!route.query) return true

          const routeQuery = normalizeQuery(route.query)

          return JSON.stringify(routeQuery) === JSON.stringify(normalizedQuery)
        }) ?? null
      )
    },
  }
}

const serverMockRegistry = ServerMockRegistry()

export const registerServerMockRoutes = serverMockRegistry.registerServerMockRoutes
export const resetServerMockRoutes = serverMockRegistry.resetServerMockRoutes
export const findServerMockRoute = serverMockRegistry.findServerMockRoute
