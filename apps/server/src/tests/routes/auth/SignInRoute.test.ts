import { randomUUID } from 'node:crypto'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST /auth/sign-in]', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const wrongPassword = `wrong-${randomUUID()}`

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
  })

  it('should answer forbidden without a session when the account email is not confirmed', async () => {
    const { email, password } = await authFixture.createUnconfirmedAccount()

    const response = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email, password })

    expect(response.status).toBe(HTTP_STATUS_CODE.forbidden)
    expect(response.body.message).toBe('Confirme seu e-mail antes de entrar')
    expect(response.body.accessToken).toBeUndefined()
    expect(response.body.refreshToken).toBeUndefined()
    expect(response.body.account).toBeUndefined()
  })

  it('should answer the same unauthorized message for a wrong password and for an unknown email', async () => {
    const unconfirmed = await authFixture.createUnconfirmedAccount()
    await authFixture.createAccount()
    const confirmed = authFixture.getAccount()

    const unconfirmedResponse = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email: unconfirmed.email, password: wrongPassword })
    const confirmedResponse = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email: confirmed.email, password: wrongPassword })
    const unknownResponse = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email: `unknown-${randomUUID()}@stardust.dev`, password: wrongPassword })

    for (const response of [unconfirmedResponse, confirmedResponse, unknownResponse]) {
      expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
      expect(response.body.message).toBe('E-mail ou senha incorretos')
    }
  })

  it('should create a session when the account is confirmed and the credentials are correct', async () => {
    await authFixture.createAccount({ password: 'password123' })
    const account = authFixture.getAccount()

    const response = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email: account.email, password: 'password123' })

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body.account.email).toBe(account.email)
    expect(response.body.accessToken).toEqual(expect.any(String))
    expect(response.body.refreshToken).toEqual(expect.any(String))
  })

  it('should answer bad request when the email is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/auth/sign-in')
      .send({ email: 'not-an-email', password: 'password123' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
  })
})
