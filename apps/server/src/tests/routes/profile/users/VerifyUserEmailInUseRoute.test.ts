import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserEmailAlreadyInUseError } from '@stardust/core/profile/errors'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/verify-email-in-use', () => {
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

  it('should return 400 when query email is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-email-in-use?email=invalid-email',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'email', messages: ['Informe um e-mail válido!'] },
        ]),
      }),
    )
  })

  it('should return 200 when email is available', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-email-in-use?email=available@stardust.dev',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
  })

  it('should return 409 when email is already in use', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server).get(
      `/profile/users/verify-email-in-use?email=${encodeURIComponent(user.dto.email)}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new UserEmailAlreadyInUseError() }),
    )
  })
})
