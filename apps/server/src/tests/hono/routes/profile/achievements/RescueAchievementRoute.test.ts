import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import {
  AchievementNotFoundError,
  UserNotFoundError,
} from '@stardust/core/profile/errors'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/achievements/:userId/:achievementId/rescue', () => {
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
    const response = await request(honoFixture.server).put(
      `/profile/achievements/${Id.create().value}/${Id.create().value}/rescue`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when user id is invalid', async () => {
    const response = await request(honoFixture.server)
      .put(`/profile/achievements/invalid-id/${Id.create().value}/rescue`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'userId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when achievement does not exist', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put(`/profile/achievements/${user.id.value}/${Id.create().value}/rescue`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AchievementNotFoundError() }),
    )
  })

  it('should return 404 when user does not exist', async () => {
    const achievement = AchievementsFaker.fakeUniqueDto({ id: Id.create().value })
    await profileFixture.createAchievements([achievement])

    const response = await request(honoFixture.server)
      .put(`/profile/achievements/${Id.create().value}/${achievement.id}/rescue`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
  })

  it('should not rescue another account achievement or change its coins', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const user = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const achievement = AchievementsFaker.fakeUniqueDto({ id: Id.create().value })
    await profileFixture.createAchievements([achievement])
    await usersRepository.addRescuableAchievement(Id.create(achievement.id), user.id)
    const before = await profileFixture.getUserCoins(user.id.value)
    const response = await request(honoFixture.server)
      .put(`/profile/achievements/${user.id.value}/${achievement.id}/rescue`)
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(await profileFixture.getUserCoins(user.id.value)).toBe(before)
    expect(
      await profileFixture.getRescuableAchievements(
        user.id.value,
        String(achievement.id),
      ),
    ).toEqual([{ achievement_id: achievement.id }])
  })

  it('should rescue once without duplicate credit or changing another account relation', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const achievement = AchievementsFaker.fakeUniqueDto({ id: Id.create().value })
    await profileFixture.createAchievements([achievement])
    await usersRepository.addRescuableAchievement(Id.create(achievement.id), user.id)
    await usersRepository.addRescuableAchievement(Id.create(achievement.id), otherUser.id)
    const beforeCoins = await profileFixture.getUserCoins(user.id.value)
    const otherBeforeCoins = await profileFixture.getUserCoins(otherUser.id.value)
    const beforeRelation = await profileFixture.getRescuableAchievements(
      user.id.value,
      String(achievement.id),
    )
    const otherBeforeRelation = await profileFixture.getRescuableAchievements(
      otherUser.id.value,
      String(achievement.id),
    )
    expect(beforeRelation).toEqual([{ achievement_id: achievement.id }])
    expect(otherBeforeRelation).toEqual([{ achievement_id: achievement.id }])

    const response = await request(honoFixture.server)
      .put(`/profile/achievements/${user.id.value}/${achievement.id}/rescue`)
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id.value,
        coins: beforeCoins + achievement.reward,
        rescuableAchievementsIds: [],
      }),
    )
    expect(await profileFixture.getUserCoins(user.id.value)).toBe(
      beforeCoins + achievement.reward,
    )
    expect(
      await profileFixture.getRescuableAchievements(
        user.id.value,
        String(achievement.id),
      ),
    ).toEqual([])
    expect(await profileFixture.getUserCoins(otherUser.id.value)).toBe(otherBeforeCoins)
    expect(
      await profileFixture.getRescuableAchievements(
        otherUser.id.value,
        String(achievement.id),
      ),
    ).toEqual(otherBeforeRelation)

    const replay = await request(honoFixture.server)
      .put(`/profile/achievements/${user.id.value}/${achievement.id}/rescue`)
      .set(authFixture.getAuthorizationHeader())
    expect(replay.status).toBe(HTTP_STATUS_CODE.ok)
    expect(replay.body).toEqual(
      expect.objectContaining({
        id: user.id.value,
        coins: beforeCoins + achievement.reward,
        rescuableAchievementsIds: [],
      }),
    )
    expect(await profileFixture.getUserCoins(user.id.value)).toBe(
      beforeCoins + achievement.reward,
    )
    expect(
      await profileFixture.getRescuableAchievements(
        user.id.value,
        String(achievement.id),
      ),
    ).toEqual([])
    expect(await profileFixture.getUserCoins(otherUser.id.value)).toBe(otherBeforeCoins)
    expect(
      await profileFixture.getRescuableAchievements(
        otherUser.id.value,
        String(achievement.id),
      ),
    ).toEqual(otherBeforeRelation)
  })
})
