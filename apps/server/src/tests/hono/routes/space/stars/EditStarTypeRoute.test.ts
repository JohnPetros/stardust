import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /space/stars/:starId/type', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const createdStars: CreatedStar[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    createdStars.length = 0
    await authFixture.createAccount()
  })

  afterEach(async () => {
    await spaceFixture.cleanupCreatedStars(createdStars)
  })

  it('should update the star type when authenticated account is a god account', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)
    const nextType = !star.isChallenge
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .patch(`/space/stars/${star.id}/type`)
      .set(authFixture.getAuthorizationHeader())
      .send({ isChallenge: nextType })
    const fetchResponse = await request(honoFixture.server)
      .get(`/space/stars/id/${star.id}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: star.id,
        isChallenge: nextType,
      }),
    )
    expect(fetchResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(fetchResponse.body).toEqual(
      expect.objectContaining({
        id: star.id,
        isChallenge: nextType,
      }),
    )
  })
})
