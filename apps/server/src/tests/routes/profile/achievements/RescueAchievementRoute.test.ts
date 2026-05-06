import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import {
  AchievementNotFoundError,
  UserNotFoundError,
} from '@stardust/core/profile/errors'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/achievements/:userId/:achievementId/rescue', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const usersRepository = new SupabaseUsersRepository(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
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

  it('should rescue an achievement for the user', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const achievement = AchievementsFaker.fakeUniqueDto({ id: Id.create().value })
    await profileFixture.createAchievements([achievement])
    await usersRepository.addRescuableAchievement(Id.create(achievement.id), user.id)

    const response = await request(honoFixture.server)
      .put(`/profile/achievements/${user.id.value}/${achievement.id}/rescue`)
      .set(authFixture.getAuthorizationHeader())

    const rescuedUserCoins = await profileFixture.getUserCoins(user.id.value)
    const rescuableAchievements = await profileFixture.getRescuableAchievements(
      user.id.value,
      String(achievement.id),
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id.value,
        coins: achievement.reward,
        rescuableAchievementsIds: [],
      }),
    )
    expect(rescuedUserCoins).toBe(achievement.reward)
    expect(rescuableAchievements).toEqual([])
  })
})
