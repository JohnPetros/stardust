import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { AchievementNotFoundError } from '@stardust/core/profile/errors'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[DELETE] /profile/achievements/:achievementId', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).delete(
      `/profile/achievements/${Id.create().value}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .delete(`/profile/achievements/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when achievement id is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete('/profile/achievements/invalid-id')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'achievementId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when achievement does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete(`/profile/achievements/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AchievementNotFoundError() }),
    )
  })

  it('should delete an existing achievement', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const achievement = AchievementsFaker.fakeUniqueDto({
      id: Id.create().value,
    })
    await profileFixture.createAchievements([achievement])

    const currentAchievementsResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    const response = await request(honoFixture.server)
      .delete(`/profile/achievements/${achievement.id}`)
      .set(authFixture.getAuthorizationHeader())

    const updatedAchievementsResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    expect(currentAchievementsResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(currentAchievementsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: achievement.id,
          name: achievement.name,
        }),
      ]),
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    expect(updatedAchievementsResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(updatedAchievementsResponse.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: achievement.id,
          name: achievement.name,
        }),
      ]),
    )
  })
})
