import request from 'supertest'
import { createHash } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { apiKeyModel } from '@/database/drizzle/models/auth'
import { NodeCryptoApiKeySecretProvider } from '@/provision/auth'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { AuthMiddleware } from '@/app/hono/middlewares/AuthMiddleware'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'

class McpRateLimiter implements RateLimiterProvider {
  readonly calls: RateLimitInput[] = []
  constructor(private readonly allowAccount = false) {}

  async consume(input: RateLimitInput): Promise<RateLimitDecision> {
    this.calls.push(input)
    return {
      isAllowed: this.allowAccount || !input.key.includes(':account:'),
      retryAfterInSeconds: 1,
    }
  }
}

const telemetry: TelemetryProvider = { trackError: jest.fn() }

describe('MCP account rate limit composition', () => {
  const databaseFixture = new SupabaseFixture()
  const auth = new AuthFixture(databaseFixture.supabase)
  const profile = new ProfileFixture(databaseFixture.supabase)
  const secretProvider = new NodeCryptoApiKeySecretProvider()
  beforeEach(async () => {
    await databaseFixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  async function createApiKey(revoked = false) {
    const token = secretProvider.generateToken(32)
    await databaseFixture.database.insert(apiKeyModel).values({
      name: 'Local MCP integration key',
      userId: auth.getAccountId(),
      keyHash: secretProvider.hash(token),
      keyPreview: 'local-fixture',
      revokedAt: revoked ? new Date() : null,
    })
    return token
  }

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

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
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
      .set('X-Api-Key', await createApiKey())

    expect(response.status).toBe(HTTP_STATUS_CODE.tooManyRequests)
    expect(provider.calls).toHaveLength(2)
    expect(provider.calls[0]?.key).toContain(':ip:')
    expect(provider.calls[1]?.key).toContain(':account:')
  })
  it('rejects a revoked persisted key before account rate limiting', async () => {
    const provider = new McpRateLimiter()
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()
    const authMiddleware = new AuthMiddleware()
    fixture.hono.get(
      '/mcp/rate-limit-revoked',
      authMiddleware.verifyApiKeyAuthentication.bind(authMiddleware),
      (context) => context.text('handler'),
    )
    const response = await request(fixture.server)
      .get('/mcp/rate-limit-revoked')
      .set('X-Api-Key', await createApiKey(true))
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(provider.calls).toHaveLength(1)
    expect(provider.calls[0]?.key).toContain(':ip:')
  })

  it('derives the business actor from the verified key and ignores caller identity', async () => {
    const provider = new McpRateLimiter(true)
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()
    const authMiddleware = new AuthMiddleware()
    fixture.hono.get(
      '/mcp/verified-actor',
      authMiddleware.verifyApiKeyAuthentication.bind(authMiddleware),
      (context) => {
        const access = context.get('databaseAccess')
        return context.json({
          kind: access.kind,
          accountId: access.kind === 'user' ? access.accountId.value : null,
        })
      },
    )
    const response = await request(fixture.server)
      .get('/mcp/verified-actor?accountId=untrusted-account')
      .set('X-Api-Key', await createApiKey())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ kind: 'user', accountId: auth.getAccountId() })
    expect(provider.calls[1]?.key).toContain(
      createHash('sha256').update(auth.getAccountId()).digest('hex'),
    )
    const rows = await databaseFixture.database
      .select()
      .from(apiKeyModel)
      .where(eq(apiKeyModel.userId, auth.getAccountId()))
    expect(rows).toHaveLength(1)
    expect(rows[0].revokedAt).toBeNull()
  })
})
