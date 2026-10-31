import type { MiddlewareHandler } from '@mastra/core/server'

const BUILT_IN_ROUTES_PREFIX = '/api'

type DenyBuiltInRoutesConfig = {
  enabled: boolean
}

export class DenyBuiltInRoutesMiddleware {
  private readonly enabled: boolean

  constructor({ enabled }: DenyBuiltInRoutesConfig) {
    this.enabled = enabled
  }

  handle: MiddlewareHandler = async (c, next) => {
    if (!this.enabled) return next()

    const candidates = [c.req.path, new URL(c.req.url).pathname].map((path) =>
      this.normalizePath(path),
    )
    const isBuiltInRoute = candidates.some(
      (path) =>
        path === BUILT_IN_ROUTES_PREFIX || path.startsWith(`${BUILT_IN_ROUTES_PREFIX}/`),
    )

    if (isBuiltInRoute) {
      return c.json({ error: { code: 'not_found' } }, 404)
    }

    return next()
  }

  private normalizePath(path: string): string {
    let decoded = path

    try {
      decoded = decodeURIComponent(path)
    } catch {
      decoded = path
    }

    return decoded.replace(/\/{2,}/g, '/').toLowerCase()
  }
}
