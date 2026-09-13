import request from 'supertest'

import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { AuthMiddleware } from '@/app/hono/middlewares/AuthMiddleware'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'

jest.mock('@/database/supabase/repositories/auth/SupabaseApiKeysRepository', () => ({
  SupabaseApiKeysRepository: jest.fn().mockImplementation(() => ({
    findByHash: jest.fn().mockResolvedValue({
      userId: { value: 'account-1' },
      isRevoked: { isTrue: false },
    }),
  })),
}))

jest.mock('@/provision/auth/NodeCryptoApiKeySecretProvider', () => ({
  NodeCryptoApiKeySecretProvider: jest.fn().mockImplementation(() => ({
    hash: jest.fn().mockReturnValue('hashed-api-key'),
  })),
}))

class McpRateLimiter implements RateLimiterProvider {
  readonly calls: RateLimitInput[] = []

  async consume(input: RateLimitInput): Promise<RateLimitDecision> {
    this.calls.push(input)
    return {
      isAllowed: !input.key.includes(':account:'),
      retryAfterInSeconds: 1,
    }
  }
}

const telemetry: TelemetryProvider = { trackError: jest.fn() }

describe('MCP account rate limit composition', () => {
  it('does not consume an account when API-key authentication fails', async () => {
    const provider = new McpRateLimiter()
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()

    const authMiddleware = new AuthMiddleware()
    fixture.hono.get(
      '/mcp/rate-limit-auth-failure',
      authMiddleware.verifyApiKeyAuthentication.bind(authMiddleware),
      (context) => context.text('handler'),
    )

    const response = await request(fixture.server).get('/mcp/rate-limit-auth-failure')

    expect(response.status).toBe(401)
    expect(provider.calls).toHaveLength(1)
    expect(provider.calls[0]?.key).toContain(':ip:')
  })

  it('limits the account only after a valid API key has been verified', async () => {
    const provider = new McpRateLimiter()
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()

    const authMiddleware = new AuthMiddleware()
    fixture.hono.get(
      '/mcp/rate-limit-auth-success',
      authMiddleware.verifyApiKeyAuthentication.bind(authMiddleware),
      (context) => context.text('handler'),
    )

    const response = await request(fixture.server)
      .get('/mcp/rate-limit-auth-success')
      .set('X-Api-Key', 'test-api-key')

    expect(response.status).toBe(429)
    expect(provider.calls).toHaveLength(2)
    expect(provider.calls[0]?.key).toContain(':ip:')
    expect(provider.calls[1]?.key).toContain(':account:')
  })
})
