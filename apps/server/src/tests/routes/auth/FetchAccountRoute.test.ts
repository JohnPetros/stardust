import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Email, Id, Name } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /auth/account', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
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

  it('rejects a request without an authenticated session', async () => {
    const response = await request(hono.server).get('/auth/account')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('does not authenticate an account using a valid onboarding receipt alone', async () => {
    const provider = new NodeOnboardingReceiptProvider(ENV.onboardingReceiptSecret)
    const { receipt } = await provider.issue(
      Id.create(auth.getAccountId()),
      Email.create(auth.getAccount().email),
      Name.create('Signed attempt name'),
    )
    const response = await request(hono.server)
      .get('/auth/account')
      .set('X-Onboarding-Receipt', receipt.value)
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })

  it('rejects a forged bearer instead of trusting its account claim', async () => {
    const payload = Buffer.from(
      JSON.stringify({
        sub: auth.getAccountId(),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString('base64url')
    const response = await request(hono.server)
      .get('/auth/account')
      .set('Authorization', `Bearer eyJhbGciOiJub25lIn0.${payload}.forged`)
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
  })

  it.each([
    {
      label: 'latest Google identity',
      metadata: { full_name: 'Metadata Name', user_name: 'metadata-login' },
      identities: [
        {
          provider: 'github' as const,
          data: { user_name: 'github-login', full_name: 'Github Name' },
          order: 1,
        },
        {
          provider: 'google' as const,
          data: { full_name: 'Google Name', user_name: 'google-login' },
          order: 2,
        },
      ],
      expected: 'Google Name',
    },
    {
      label: 'Google metadata fallback',
      metadata: { full_name: 'Metadata Name' },
      identities: [{ provider: 'google' as const, data: {}, order: 2 }],
      expected: 'Metadata Name',
    },
    {
      label: 'latest Github login',
      metadata: { full_name: 'Metadata Name' },
      identities: [
        { provider: 'google' as const, data: { full_name: 'Google Name' }, order: 1 },
        {
          provider: 'github' as const,
          data: { user_name: 'github-login', full_name: 'Github Name' },
          order: 2,
        },
      ],
      expected: 'github-login',
    },
    {
      label: 'Github metadata fallback',
      metadata: { user_name: 'metadata-login' },
      identities: [{ provider: 'github' as const, data: {}, order: 2 }],
      expected: 'metadata-login',
    },
    {
      label: 'newer first identity',
      metadata: {},
      identities: [
        {
          provider: 'google' as const,
          data: { full_name: 'Latest Google Name' },
          order: 2,
        },
        {
          provider: 'github' as const,
          data: { user_name: 'older-github-login' },
          order: 1,
        },
      ],
      expected: 'Latest Google Name',
    },
    {
      label: 'creation timestamp when identity has no sign-in timestamp',
      metadata: {},
      identities: [
        {
          provider: 'github' as const,
          data: { user_name: 'github-login' },
          order: 2,
          missingSignIn: true,
        },
      ],
      expected: 'github-login',
    },
    {
      label: 'email-account metadata',
      metadata: { full_name: 'Metadata Name' },
      identities: [],
      expected: 'Metadata Name',
    },
  ])(
    'returns name from $label through real Auth',
    async ({ metadata, identities, expected }) => {
      await fixture.setAuthMetadata(Id.create(auth.getAccountId()), {
        userMetadata: metadata,
        identities: identities.map((identity) => {
          const createdAt = new Date(Date.now() + identity.order * 1000)
          return {
            provider: identity.provider,
            identityData: identity.data,
            createdAt,
            lastSignInAt: 'missingSignIn' in identity ? null : createdAt,
          }
        }),
      })
      const response = await request(hono.server)
        .get('/auth/account')
        .set(auth.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual({
        id: auth.getAccountId(),
        email: auth.getAccount().email,
        name: expected,
        isAuthenticated: true,
      })
    },
  )
})
