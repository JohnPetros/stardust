import { createHash, timingSafeEqual } from 'node:crypto'

import type { MiddlewareHandler } from '@mastra/core/server'

import { env } from '@/env'

type ApiKeyAgent = 'pr-reviewer'

const BEARER_PREFIX = 'Bearer '

export class AgentApiKeyMiddleware {
  private readonly apiKeys: Record<ApiKeyAgent, string> = {
    'pr-reviewer': env.PR_REVIEWER_API_KEY,
  }

  constructor(private readonly agent: ApiKeyAgent) {}

  handle: MiddlewareHandler = async (c, next) => {
    const authorization = c.req.header('Authorization') ?? ''
    const token = authorization.startsWith(BEARER_PREFIX)
      ? authorization.slice(BEARER_PREFIX.length)
      : ''

    const isAuthorized = timingSafeEqual(
      this.hashValue(token),
      this.hashValue(this.apiKeys[this.agent]),
    )

    if (!token || !isAuthorized) {
      return c.json({ error: { code: 'unauthorized' } }, 401)
    }

    return next()
  }

  private hashValue(value: string): Buffer {
    return createHash('sha256').update(value).digest()
  }
}
