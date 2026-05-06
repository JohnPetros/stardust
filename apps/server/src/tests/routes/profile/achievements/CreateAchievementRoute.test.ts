import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /profile/achievements', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const achievement = AchievementsFaker.fakeUniqueDto()

    const response = await request(honoFixture.server)
      .post('/profile/achievements')
      .send(achievement)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const achievement = AchievementsFaker.fakeUniqueDto()

    const response = await request(honoFixture.server)
      .post('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())
      .send(achievement)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...AchievementsFaker.fakeUniqueDto(),
        name: 'ab',
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['nome deve conter pelo menos 3 caracteres'] },
        ]),
      }),
    )
  })

  it('should create an achievement', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const currentAchievementsResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())
    const lastPosition = Math.max(
      ...currentAchievementsResponse.body.map(
        (item: { position: number }) => item.position,
      ),
    )

    const achievement = AchievementsFaker.fakeUniqueDto()

    const response = await request(honoFixture.server)
      .post('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())
      .send(achievement)

    const updatedAchievementsResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    expect(currentAchievementsResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...achievement,
        id: expect.any(String),
        position: lastPosition + 1,
      }),
    )
    expect(updatedAchievementsResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(updatedAchievementsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: response.body.id,
          name: achievement.name,
        }),
      ]),
    )
  })
})
