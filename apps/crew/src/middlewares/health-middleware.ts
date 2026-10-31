import type { MiddlewareHandler } from '@mastra/core/server'

import type { CrewDatabase } from '@/database/drizzle'

export class HealthMiddleware {
  constructor(private readonly crewDatabase: CrewDatabase) {}

  handle: MiddlewareHandler = async (c, next) => {
    if (c.req.method !== 'GET') return next()

    return (await this.crewDatabase.isHealthy())
      ? c.json({ status: 'ok' }, 200)
      : c.json({ status: 'unavailable' }, 503)
  }

  middleware(): { path: string; handler: MiddlewareHandler } {
    return { path: '/health', handler: this.handle }
  }
}
