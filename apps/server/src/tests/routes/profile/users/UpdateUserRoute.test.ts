import request from 'supertest'
import { asc, inArray } from 'drizzle-orm'
import { userModel } from '@/database/drizzle/schema'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNotFoundError } from '@stardust/core/profile/errors'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/users/:userId', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const usersRepository = new DrizzleUsersRepository(supabaseFixture.database, {
    kind: 'system',
  })

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
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

  it('should not update another account profile', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    const existingUser = await usersRepository.findById(
      Id.create(otherAccount.getAccountId()),
    )
    if (!existingUser) throw new Error('Expected the other account profile to exist')
    const before = existingUser.dto
    const response = await request(honoFixture.server)
      .put(`/profile/users/${otherAccount.getAccountId()}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ ...before, name: 'Unauthorized profile mutation' })
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    const after = await usersRepository.findById(Id.create(otherAccount.getAccountId()))
    expect(after?.dto).toEqual(before)
  })

  it('should use the route identity and deny another account despite conflicting body identity', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const persistedUser = await usersRepository.findById(user.id)
    const persistedOtherUser = await usersRepository.findById(otherUser.id)
    if (!persistedUser || !persistedOtherUser)
      throw new Error('Expected both persisted account profiles')
    async function readProfiles() {
      return supabaseFixture.database
        .select()
        .from(userModel)
        .where(inArray(userModel.id, [user.id.value, otherUser.id.value]))
        .orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(2)
    const suffix = Id.create().value.slice(0, 8)
    const validUpdate = {
      ...persistedUser.dto,
      name: `route-owner-${suffix}`,
      email: `route-owner-${suffix}@stardust.dev`,
    }
    const response = await request(honoFixture.server)
      .put(`/profile/users/${user.id.value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ ...validUpdate, id: otherUser.id.value })
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id.value,
        name: validUpdate.name,
        email: validUpdate.email,
      }),
    )
    const afterUpdate = await readProfiles()
    expect(afterUpdate.find((row) => row.id === user.id.value)).toEqual(
      expect.objectContaining({
        id: user.id.value,
        name: validUpdate.name,
        email: validUpdate.email,
      }),
    )
    expect(afterUpdate.find((row) => row.id === otherUser.id.value)).toEqual(
      before.find((row) => row.id === otherUser.id.value),
    )
    const denied = await request(honoFixture.server)
      .put(`/profile/users/${user.id.value}`)
      .set(otherAccount.getAuthorizationHeader())
      .send(persistedOtherUser.dto)
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
    expect(await readProfiles()).toEqual(afterUpdate)
  })

  it('should update the user', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const existingUser = await usersRepository.findById(
      Id.create(authFixture.getAccountId()),
    )

    if (!existingUser) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const uniqueSuffix = Id.create().value.slice(0, 8)
    const payload = {
      ...existingUser.dto,
      name: `updated-user-${uniqueSuffix}`,
      email: `updated-user-${uniqueSuffix}@stardust.dev`,
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
