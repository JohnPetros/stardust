import request from 'supertest'
import { asc, inArray } from 'drizzle-orm'
import { userUnlockedAchievementModel } from '@/database/drizzle/schema'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/achievements/:userId', () => {
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
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      `/profile/achievements/${Id.create().value}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when user id is invalid', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/achievements/invalid-id')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'userId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return an empty list when user has no unlocked achievements', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .get(`/profile/achievements/${user.id.value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([])
  })

  it('should order unlocked achievements and isolate each authenticated owner', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const first = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 1 })
    const second = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 2 })
    const locked = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 3 })
    const exclusive = AchievementsFaker.fakeUniqueDto({
      id: Id.create().value,
      position: 4,
    })
    await profileFixture.createAchievements([second, first, locked, exclusive])
    await usersRepository.addUnlockedAchievement(Id.create(second.id), user.id)
    await usersRepository.addUnlockedAchievement(Id.create(first.id), user.id)
    await usersRepository.addUnlockedAchievement(Id.create(exclusive.id), otherUser.id)
    async function readUnlockedRelations() {
      return supabaseFixture.database
        .select()
        .from(userUnlockedAchievementModel)
        .where(
          inArray(userUnlockedAchievementModel.userId, [
            user.id.value,
            otherUser.id.value,
          ]),
        )
        .orderBy(
          asc(userUnlockedAchievementModel.userId),
          asc(userUnlockedAchievementModel.achievementId),
        )
    }
    const before = await readUnlockedRelations()
    expect(before).toHaveLength(3)
    expect(
      before
        .filter((row) => row.userId === user.id.value)
        .map((row) => row.achievementId),
    ).toEqual([first.id, second.id].sort())
    expect(before.filter((row) => row.userId === otherUser.id.value)).toEqual([
      { userId: otherUser.id.value, achievementId: exclusive.id },
    ])

    const response = await request(honoFixture.server)
      .get(`/profile/achievements/${user.id.value}`)
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([first, second])
    const otherResponse = await request(honoFixture.server)
      .get(`/profile/achievements/${otherUser.id.value}`)
      .set(otherAccount.getAuthorizationHeader())
    expect(otherResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(otherResponse.body).toEqual([exclusive])
    const denied = await request(honoFixture.server)
      .get(`/profile/achievements/${user.id.value}`)
      .set(otherAccount.getAuthorizationHeader())
    expect(denied.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(denied.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
    expect(denied.text).not.toContain(String(first.id))
    expect(denied.text).not.toContain(String(second.id))
    expect(await readUnlockedRelations()).toEqual(before)
  })
})
