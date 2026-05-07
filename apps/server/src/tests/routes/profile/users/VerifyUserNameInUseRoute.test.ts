import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNameAlreadyInUseError } from '@stardust/core/profile/errors'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/verify-name-in-use', () => {
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

  it('should return 400 when query name is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-name-in-use?name=ab',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['Seu nome deve conter pelo menos 3 letras'] },
        ]),
      }),
    )
  })

  it('should return 200 when name is available', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-name-in-use?name=NomeDisponivel',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
  })

  it('should return 409 when name is already in use', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server).get(
      `/profile/users/verify-name-in-use?name=${encodeURIComponent(user.dto.name)}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new UserNameAlreadyInUseError() }),
    )
  })
})
