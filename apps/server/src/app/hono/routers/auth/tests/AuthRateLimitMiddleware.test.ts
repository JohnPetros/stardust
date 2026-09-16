import request from 'supertest'

import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { AuthMiddleware } from '@/app/hono/middlewares/AuthMiddleware'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'

jest.mock('@/rest/services/SupabaseAuthService', () => ({
  SupabaseAuthService: jest.fn().mockImplementation(() => ({
    fetchAccount: jest.fn().mockResolvedValue({
      isFailure: false,
      body: {
        id: 'account-1',
        email: 'account@example.test',
        name: 'Account',
        isAuthenticated: true,
      },
    }),
  })),
}))

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
      .set('X-Forwarded-For', '198.51.100.30')

    expect(response.status).toBe(429)
    expect(provider.calls).toHaveLength(2)
    expect(provider.calls[0]?.key).toContain(':ip:')
    expect(provider.calls[1]?.key).toContain(':account:')
  })
})
