import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  ConflictError,
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

describe('[PATCH] /profile/achievements/order', () => {
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
    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .send({ achievementIds: [Id.create().value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ achievementIds: [Id.create().value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when payload contains invalid achievement id', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ achievementIds: ['invalid-id'] })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([]),
      }),
    )
  })

  it('should return 409 when payload contains duplicate ids', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const duplicatedId = Id.create().value

    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ achievementIds: [duplicatedId, duplicatedId] })

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ConflictError('Todos os IDs das conquistas devem ser fornecidos e únicos'),
      }),
    )
  })

  it('should return 404 when any achievement does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const achievements = AchievementsFaker.fakeManyUniqueDto(2)
    await profileFixture.createAchievements(achievements)

    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .set(authFixture.getAuthorizationHeader())
      .send({
        achievementIds: [achievements[0].id!, Id.create().value],
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AchievementNotFoundError() }),
    )
  })

  it('should reorder achievements', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const achievements = AchievementsFaker.fakeManyUniqueDto(3)
    await profileFixture.createAchievements(achievements)
    const reorderedIds = [achievements[2].id!, achievements[0].id!, achievements[1].id!]

    const response = await request(honoFixture.server)
      .patch('/profile/achievements/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ achievementIds: reorderedIds })

    const fetchResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([
      expect.objectContaining({ id: reorderedIds[0], position: 1 }),
      expect.objectContaining({ id: reorderedIds[1], position: 2 }),
      expect.objectContaining({ id: reorderedIds[2], position: 3 }),
    ])
    expect(fetchResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(fetchResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: reorderedIds[0], position: 1 }),
        expect.objectContaining({ id: reorderedIds[1], position: 2 }),
        expect.objectContaining({ id: reorderedIds[2], position: 3 }),
      ]),
    )
  })
})
