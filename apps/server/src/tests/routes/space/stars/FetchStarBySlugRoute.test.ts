import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { StarNotFoundError } from '@stardust/core/space/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/stars/slug/:starSlug', () => {
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

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      '/space/stars/slug/variables-basics',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 404 when star does not exist', async () => {
    const response = await request(honoFixture.server)
      .get('/space/stars/slug/unknown-star')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new StarNotFoundError() }))
  })

  it('should return the requested star by slug', async () => {
    const star = await spaceFixture.createStar()
    createdStars.push(star)

    const response = await request(honoFixture.server)
      .get(`/space/stars/slug/${star.slug}`)
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
