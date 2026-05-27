import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/stars/id/:starId', () => {
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
      .get('/space/stars/id/invalid-id')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'starId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return the requested star by id', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)

    const response = await request(honoFixture.server)
      .get(`/space/stars/id/${star.id}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: star.id,
        name: star.name,
        slug: star.slug,
        number: star.number,
        isAvailable: star.isAvailable,
        isChallenge: star.isChallenge,
        unlockCount: expect.any(Number),
        userCount: expect.any(Number),
      }),
    )
  })
})
