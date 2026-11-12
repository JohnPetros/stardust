import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Id } from '@stardust/core/global/structures'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST /auth/resend-email/sign-up]', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
  })

  it('should resend the confirmation email and persist a newer sent date', async () => {
    const { accountId, email } = await authFixture.createUnconfirmedAccount()
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    await supabaseFixture.setConfirmationSentAt(Id.create(accountId), twoMinutesAgo)

    const response = await request(honoFixture.server)
      .post('/auth/resend-email/sign-up')
      .send({ email })

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    const sentAt = await supabaseFixture.getConfirmationSentAt(Id.create(accountId))
    expect(sentAt).not.toBeNull()
    expect(sentAt?.getTime() ?? 0).toBeGreaterThan(twoMinutesAgo.getTime())
  })

  it('should answer too many requests when the provider limits the resend', async () => {
    const { email } = await authFixture.createUnconfirmedAccount()

    const response = await request(honoFixture.server)
      .post('/auth/resend-email/sign-up')
      .send({ email })

    expect(response.status).toBe(HTTP_STATUS_CODE.tooManyRequests)
    expect(response.body.message).toBe(
      'Aguarde alguns instantes antes de reenviar o e-mail',
    )
  })

  it('should answer bad request when the email is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/auth/resend-email/sign-up')
      .send({ email: 'not-an-email' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
  })
})
