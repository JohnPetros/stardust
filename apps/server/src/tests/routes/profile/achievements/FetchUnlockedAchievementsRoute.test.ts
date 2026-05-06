import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/achievements/:userId', () => {
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

  it('should return unlocked achievements for the requested user', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())

    const unlockedAchievements = AchievementsFaker.fakeManyUniqueDto(2)
    const lockedAchievement = AchievementsFaker.fakeUniqueDto()
    await profileFixture.createAchievements([...unlockedAchievements, lockedAchievement])

    for (const achievement of unlockedAchievements) {
      await usersRepository.addUnlockedAchievement(Id.create(achievement.id), user.id)
    }

    const response = await request(honoFixture.server)
      .get(`/profile/achievements/${user.id.value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toHaveLength(unlockedAchievements.length)
    expect(response.body).toEqual(expect.arrayContaining(unlockedAchievements))
    expect(response.body).not.toEqual(expect.arrayContaining([lockedAchievement]))
  })
})
