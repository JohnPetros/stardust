import { createAdaptorServer, type ServerType } from '@hono/node-server'

import { HonoApp } from '@/app/hono/HonoApp'
import type { RateLimitClock } from '@/app/hono/middlewares/RateLimitMiddleware'
import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

class AllowAllRateLimiterProvider implements RateLimiterProvider {
  async consume(_input: RateLimitInput): Promise<RateLimitDecision> {
    return { isAllowed: true, retryAfterInSeconds: 1 }
  }
}

const noopTelemetryProvider: TelemetryProvider = {
  trackError: () => undefined,
}

export class HonoFixture {
  private readonly app: HonoApp
  readonly server: ServerType

  get hono() {
    return this.app.hono
  }

  constructor(
    rateLimiterProvider: RateLimiterProvider = new AllowAllRateLimiterProvider(),
    telemetryProvider: TelemetryProvider = noopTelemetryProvider,
    rateLimitClock?: RateLimitClock,
  ) {
    this.app = new HonoApp(rateLimiterProvider, telemetryProvider, rateLimitClock)
    this.server = createAdaptorServer({ fetch: this.app.hono.fetch })
  }

  async setup() {
    this.app.setup()
  }
}
