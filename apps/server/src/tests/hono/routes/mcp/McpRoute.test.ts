import request from 'supertest'
import { createHash } from 'node:crypto'
import { eq } from 'drizzle-orm'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { apiKeyModel } from '@/database/drizzle/models/auth'
import { NodeCryptoApiKeySecretProvider } from '@/provision/auth'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

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

describe('[GET] /mcp', () => {
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const secretProvider = new NodeCryptoApiKeySecretProvider()

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  async function createApiKey(revoked = false) {
    const token = secretProvider.generateToken(32)
    await supabaseFixture.database.insert(apiKeyModel).values({
      name: 'Local MCP integration key',
      userId: authFixture.getAccountId(),
      keyHash: secretProvider.hash(token),
      keyPreview: 'local-fixture',
      revokedAt: revoked ? new Date() : null,
    })
    return token
  }

  async function createHono(provider: RateLimiterProvider) {
    const fixture = new HonoFixture(provider, telemetry)
    await fixture.setup()
    return fixture
  }

  it('does not consume an account when API-key authentication fails', async () => {
    const provider = new McpRateLimiter()
    const fixture = await createHono(provider)

    const response = await request(fixture.server).get('/mcp')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(provider.calls).toHaveLength(1)
    expect(provider.calls[0]?.key).toContain(':ip:')
  })

  it('limits the account only after a valid API key has been verified', async () => {
    const provider = new McpRateLimiter()
    const fixture = await createHono(provider)

    const response = await request(fixture.server)
      .get('/mcp')
      .set('X-Api-Key', await createApiKey())

    expect(response.status).toBe(HTTP_STATUS_CODE.tooManyRequests)
    expect(provider.calls).toHaveLength(2)
    expect(provider.calls[0]?.key).toContain(':ip:')
    expect(provider.calls[1]?.key).toContain(':account:')
  })

  it('rejects a revoked persisted key before account rate limiting', async () => {
    const provider = new McpRateLimiter()
    const fixture = await createHono(provider)

    const response = await request(fixture.server)
      .get('/mcp')
      .set('X-Api-Key', await createApiKey(true))

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(provider.calls).toHaveLength(1)
    expect(provider.calls[0]?.key).toContain(':ip:')
  })

  it('derives the business actor from the verified key and ignores caller identity', async () => {
    const provider = new McpRateLimiter(true)
    const fixture = await createHono(provider)

    const response = await request(fixture.server)
      .get('/mcp?accountId=untrusted-account')
      .set('X-Api-Key', await createApiKey())

    expect(response.status).toBe(HTTP_STATUS_CODE.notAllowed)
    expect(provider.calls).toHaveLength(2)
    const accountDigest = createHash('sha256')
      .update(authFixture.getAccountId())
      .digest('hex')
    expect(provider.calls[1]?.key).toContain(accountDigest)
    const rows = await supabaseFixture.database
      .select()
      .from(apiKeyModel)
      .where(eq(apiKeyModel.userId, authFixture.getAccountId()))
    expect(rows).toHaveLength(1)
    expect(rows[0].revokedAt).toBeNull()
  })
})
