import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNotFoundError } from '@stardust/core/profile/errors'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/users/:userId', () => {
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
    const response = await request(honoFixture.server)
      .put(`/profile/users/${Id.create().value}`)
      .send(UsersFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when user id is invalid', async () => {
    const response = await request(honoFixture.server)
      .put('/profile/users/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send(UsersFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'userId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when user does not exist', async () => {
    const response = await request(honoFixture.server)
      .put(`/profile/users/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send(UsersFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
  })

  it('should update the user', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const existingUser = await usersRepository.findById(
      Id.create(authFixture.getAccountId()),
    )

    if (!existingUser) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const updatedFields = UsersFaker.fakeDto()
    const payload = {
      ...existingUser.dto,
      name: updatedFields.name,
      email: updatedFields.email,
    }

    const response = await request(honoFixture.server)
      .put(`/profile/users/${existingUser.dto.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send(payload)

    const updatedUser = await usersRepository.findById(Id.create(existingUser.dto.id))

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: existingUser.dto.id,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
        rocket: payload.rocket,
        tier: payload.tier,
      }),
    )
    expect(updatedUser?.dto).toEqual(
      expect.objectContaining({
        id: existingUser.dto.id,
        name: payload.name,
        email: payload.email,
      }),
    )
  })
})
