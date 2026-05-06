import request from 'supertest'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'

describe('[GET] /profile/achievements', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/profile/achievements')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return a list of achievements when authenticated', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          icon: expect.any(String),
          metric: expect.any(String),
          requiredCount: expect.any(Number),
          reward: expect.any(Number),
          position: expect.any(Number),
        }),
      ]),
    )
  })

  it('should return newly created achievements with the existing collection', async () => {
    const initialResponse = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    const achievements = AchievementsFaker.fakeManyUniqueDto()
    await profileFixture.createAchievements(achievements)

    const response = await request(honoFixture.server)
      .get('/profile/achievements')
      .set(authFixture.getAuthorizationHeader())

    expect(initialResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(expect.arrayContaining(achievements))
  })
})
