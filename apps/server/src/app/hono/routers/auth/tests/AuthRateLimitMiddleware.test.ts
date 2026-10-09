import { createHash } from 'node:crypto'
import request from 'supertest'

import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { AuthMiddleware } from '@/app/hono/middlewares/AuthMiddleware'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'

class AuthRateLimiter implements RateLimiterProvider {
  readonly calls: RateLimitInput[] = []

  async consume(input: RateLimitInput): Promise<RateLimitDecision> {
    this.calls.push(input)
    return {
      isAllowed: !input.key.includes(':account:'),
      retryAfterInSeconds: 1,
    }
  }
}

describe('REST account rate limit composition', () => {
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  it('runs IP limiting before verified authentication and account limiting after it', async () => {
    const provider = new AuthRateLimiter()
    const telemetry: TelemetryProvider = { trackError: jest.fn() }
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()

    const authMiddleware = new AuthMiddleware()
    fixture.hono.get(
      '/rate-limit-auth',
      authMiddleware.verifyAuthentication.bind(authMiddleware),
      (context) => context.text('handler'),
    )

    const response = await request(fixture.server)
      .get('/rate-limit-auth')
      .set(authFixture.getAuthorizationHeader())
      .set('X-Forwarded-For', '198.51.100.30')

    expect(response.status).toBe(429)
    expect(provider.calls).toHaveLength(2)
    expect(provider.calls[0]?.key).toContain(':ip:')
    const accountDigest = createHash('sha256')
      .update(authFixture.getAccountId())
      .digest('hex')
    expect(provider.calls[1]?.key).toBe(`rate-limit:general:account:${accountDigest}`)
  })
})
