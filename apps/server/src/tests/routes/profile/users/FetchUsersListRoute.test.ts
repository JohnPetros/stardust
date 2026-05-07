import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const usersRepository = new SupabaseUsersRepository(supabaseFixture.supabase)

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
      '/profile/users?page=1&itemsPerPage=10',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when page is invalid', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users?page=0&itemsPerPage=10')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'page',
            messages: ['Number must be greater than or equal to 1'],
          },
        ]),
      }),
    )
  })

  it('should return a paginated list of users', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server)
      .get('/profile/users?page=1&itemsPerPage=10')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(
      Number(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]),
    ).toBeGreaterThan(0)
    expect(
      Number(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]),
    ).toBeGreaterThan(0)
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('10')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user.dto.id,
          name: user.dto.name,
          slug: user.dto.slug,
          email: user.dto.email,
          avatar: user.dto.avatar,
          rocket: user.dto.rocket,
          tier: user.dto.tier,
        }),
      ]),
    )
  })
})
