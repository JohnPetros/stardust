import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, NotGodAccountError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /space/stars/:starId/availability', () => {
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
    createdStars.length = 0
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterEach(async () => {
    await spaceFixture.cleanupCreatedStars(createdStars)
  })

  it('should return 401 when not authenticated', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)

    const response = await request(honoFixture.server)
      .patch(`/space/stars/${star.id}/availability`)
      .send({ isAvailable: !star.isAvailable })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)

    const response = await request(honoFixture.server)
      .patch(`/space/stars/${star.id}/availability`)
      .set(authFixture.getAuthorizationHeader())
      .send({ isAvailable: !star.isAvailable })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should update the star availability when authenticated as a god account', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const star = await spaceFixture.createStar()
    createdStars.push(star)

    const response = await request(honoFixture.server)
      .patch(`/space/stars/${star.id}/availability`)
      .set(authFixture.getAuthorizationHeader())
      .send({ isAvailable: !star.isAvailable })

    const fetchResponse = await request(honoFixture.server)
      .get(`/space/stars/id/${star.id}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: star.id,
        isAvailable: !star.isAvailable,
      }),
    )
    expect(fetchResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(fetchResponse.body).toEqual(
      expect.objectContaining({
        id: star.id,
        isAvailable: !star.isAvailable,
      }),
    )
  })
})
