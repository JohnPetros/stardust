import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/daily-active-users-report', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/daily-active-users-report?days=3',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when days is invalid', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users/daily-active-users-report?days=-1')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'days',
            messages: ['Number must be greater than or equal to 0'],
          },
        ]),
      }),
    )
  })

  it('should return the daily active users report', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users/daily-active-users-report?days=3')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toHaveLength(3)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          web: 0,
          mobile: 0,
        }),
      ]),
    )
  })
})
