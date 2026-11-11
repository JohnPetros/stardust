import { randomUUID } from 'node:crypto'
import { sql, eq } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Text } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { userModel } from '@/database/drizzle/models/profile'
import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST /auth/sign-up]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const input = () => ({
    email: `signup-${randomUUID()}@stardust.dev`,
    password: randomUUID(),
    name: `Signup ${randomUUID()}`,
  })
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    await fixture.clearDatabase()
  })

  it('persists an unconfirmed Auth account and authorizes onboarding without creating a session', async () => {
    const body = input()
    const response = await request(hono.server).post('/auth/sign-up').send(body)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      id: expect.any(String),
      email: body.email,
      name: '',
      isAuthenticated: false,
    })
    expect(response.headers['x-onboarding-signup-eligible']).toBeUndefined()
    const rows = await fixture.database.execute(
      sql`SELECT id, email, email_confirmed_at, raw_user_meta_data FROM auth.users WHERE id = ${response.body.id}::uuid`,
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual(
      expect.objectContaining({
        id: response.body.id,
        email: body.email,
        email_confirmed_at: null,
        raw_user_meta_data: expect.objectContaining({
          onboarding_attempt_nonce: expect.any(String),
        }),
      }),
    )
    expect(
      await fixture.database
        .select()
        .from(userModel)
        .where(eq(userModel.id, response.body.id)),
    ).toEqual([])
    const receipt = response.headers['x-onboarding-receipt']
    expect(typeof receipt).toBe('string')
    const attempt = await new NodeOnboardingReceiptProvider(
      ENV.onboardingReceiptSecret,
    ).verify(Text.create(receipt))
    expect(attempt.accountId.value).toBe(response.body.id)
    expect(attempt.email.value).toBe(body.email)
    expect(attempt.name.value).toBe(body.name)
    expect(response.headers['x-onboarding-expires-at']).toBe(
      attempt.expiresAt.toISOString(),
    )
    const pending = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set('X-Onboarding-Receipt', receipt)
    expect(pending.status).toBe(HTTP_STATUS_CODE.ok)
    expect(pending.body).toEqual({
      account: { id: response.body.id, email: body.email, name: body.name },
      expiresAt: attempt.expiresAt.toISOString(),
      isUserCreated: false,
    })
    expect(attempt.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(attempt.expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 15 * 60 * 1000)
    expect(JSON.stringify(response.body)).not.toContain(receipt)
    const protectedResponse = await request(hono.server)
      .get('/auth/account')
      .set('X-Onboarding-Receipt', receipt)
    expect(protectedResponse.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(
      await fixture.database
        .select()
        .from(userModel)
        .where(eq(userModel.id, response.body.id)),
    ).toEqual([])
  })

  it('rejects invalid signup input without storing an Auth account or issuing a receipt', async () => {
    const body = { ...input(), password: '' }
    const response = await request(hono.server).post('/auth/sign-up').send(body)
    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.headers['x-onboarding-receipt']).toBeUndefined()
    expect(response.headers['x-onboarding-expires-at']).toBeUndefined()
    const rows = await fixture.database.execute(
      sql`SELECT id FROM auth.users WHERE email = ${body.email}`,
    )
    expect(rows).toEqual([])
  })

  it('preserves confirmed-account duplicate signup privacy without granting a receipt', async () => {
    const body = input()
    await auth.createAccount(body)
    const response = await request(hono.server).post('/auth/sign-up').send(body)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({ email: body.email, isAuthenticated: false }),
    )
    expect(response.headers['x-onboarding-receipt']).toBeUndefined()
    expect(response.headers['x-onboarding-expires-at']).toBeUndefined()
    expect(response.headers['x-onboarding-signup-eligible']).toBeUndefined()
    const rows = await fixture.database.execute(
      sql`SELECT id FROM auth.users WHERE email = ${body.email}`,
    )
    expect(rows).toEqual([expect.objectContaining({ id: auth.getAccountId() })])
  })
})
