import { createHmac, randomUUID } from 'node:crypto'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Email, Id, Name } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/onboarding-attempt', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const receipts = new NodeOnboardingReceiptProvider(ENV.onboardingReceiptSecret)
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    await fixture.clearDatabase()
    await auth.createAccount()
  })
  async function issueReceipt() {
    return receipts.issue(
      Id.create(auth.getAccountId()),
      Email.create(auth.getAccount().email),
      Name.create('Signed attempt name'),
    )
  }

  it('rejects a missing receipt even with an authenticated bearer', async () => {
    const response = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('rejects a tampered receipt', async () => {
    const { receipt } = await issueReceipt()
    const [payload, signature] = receipt.value.split('.')
    const tampered = `${payload}.${signature[0] === 'A' ? 'B' : 'A'}${signature.slice(1)}`
    const response = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set('X-Onboarding-Receipt', tampered)
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('rejects an authentically signed but expired attempt', async () => {
    const exp = Math.floor(Date.now() / 1000) - 1
    const payload = Buffer.from(
      JSON.stringify({
        version: 1,
        audience: 'profile-onboarding',
        accountId: auth.getAccountId(),
        email: auth.getAccount().email,
        name: 'Expired attempt',
        nonce: randomUUID(),
        iat: exp - 900,
        exp,
      }),
    ).toString('base64url')
    const signature = createHmac('sha256', ENV.onboardingReceiptSecret)
      .update(payload)
      .digest('base64url')
    const response = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set('X-Onboarding-Receipt', `${payload}.${signature}`)
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('resumes the signed attempt and observes only its own persisted readiness without extending expiry', async () => {
    const { receipt, expiresAt } = await issueReceipt()
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    const before = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set('X-Onboarding-Receipt', receipt.value)
    const account = {
      id: auth.getAccountId(),
      email: auth.getAccount().email,
      name: 'Signed attempt name',
    }
    expect(before.status).toBe(HTTP_STATUS_CODE.ok)
    expect(before.body).toEqual({
      account,
      expiresAt: expiresAt.toISOString(),
      isUserCreated: false,
    })
    await profile.createAccountUser(auth.getAccountId())
    const after = await request(hono.server)
      .get('/profile/onboarding-attempt')
      .set('X-Onboarding-Receipt', receipt.value)
    expect(after.status).toBe(HTTP_STATUS_CODE.ok)
    expect(after.body).toEqual({
      account,
      expiresAt: expiresAt.toISOString(),
      isUserCreated: true,
    })
  })
})
