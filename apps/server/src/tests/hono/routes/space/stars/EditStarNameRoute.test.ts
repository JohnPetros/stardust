import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { StarNotFoundError } from '@stardust/core/space/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /space/stars/:starId/name', () => {
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

  it('should return 400 when star id is invalid', async () => {
    const response = await request(honoFixture.server)
      .patch('/space/stars/invalid-id/name')
      .set(authFixture.getAuthorizationHeader())
      .send({ name: 'Updated Star Name' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'starId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when star does not exist', async () => {
    const response = await request(honoFixture.server)
      .patch(`/space/stars/${Id.create().value}/name`)
      .set(authFixture.getAuthorizationHeader())
      .send({ name: 'Updated Star Name' })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new StarNotFoundError() }))
  })

  it('should update the star name and slug', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)
    const newName = 'Updated Star Name'

    const response = await request(honoFixture.server)
      .patch(`/space/stars/${star.id}/name`)
      .set(authFixture.getAuthorizationHeader())
      .send({ name: newName })
    const fetchResponse = await request(honoFixture.server)
      .get(`/space/stars/id/${star.id}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: star.id,
        name: newName,
        slug: 'updated-star-name',
        number: star.number,
        isAvailable: star.isAvailable,
        isChallenge: star.isChallenge,
      }),
    )
    expect(fetchResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(fetchResponse.body).toEqual(
      expect.objectContaining({
        id: star.id,
        name: newName,
        slug: 'updated-star-name',
        isAvailable: star.isAvailable,
        isChallenge: star.isChallenge,
      }),
    )
  })
})
