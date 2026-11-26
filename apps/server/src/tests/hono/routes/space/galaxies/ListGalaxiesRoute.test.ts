import request from 'supertest'
import { eq } from 'drizzle-orm'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { userModel, userCompletedStarModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/galaxies', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await spaceFixture.restoreAllSuspendedGalaxies()
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    createdGalaxies.length = 0
    await supabaseFixture.clearDatabase()
    suspendedGalaxies = await spaceFixture.suspendExistingGalaxies()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  afterEach(async () => {
    await spaceFixture.cleanupCreatedGalaxies(createdGalaxies)
    await spaceFixture.restoreSuspendedGalaxies(suspendedGalaxies)
  })

  async function createGalaxy(overrides: Partial<CreatedGalaxy>) {
    const galaxy = await spaceFixture.createGalaxy(overrides)
    createdGalaxies.push(galaxy)
    return galaxy
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/space/galaxies')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should count the planets completed by the authenticated account', async () => {
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const stars = []
    for (let index = 0; index < 10; index++) {
      stars.push(await spaceFixture.createStar(galaxy.id))
    }
    await supabaseFixture.database.insert(userCompletedStarModel).values(
      stars.slice(0, 4).map((star) => ({
        userId: authFixture.getAccountId(),
        starId: star.id,
      })),
    )

    const response = await request(honoFixture.server)
      .get('/space/galaxies')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: galaxy.id,
        slug: galaxy.slug,
        status: 'published',
        planetsCount: 10,
        completedPlanetsCount: 4,
      }),
    )
  })

  it('should list only published and announced galaxies ordered by position', async () => {
    const unpublished = await createGalaxy({ position: 3, status: 'unpublished' })
    const secondPublished = await createGalaxy({ position: 2, status: 'published' })
    const announced = await createGalaxy({ position: 4, status: 'announced' })
    const firstPublished = await createGalaxy({ position: 1, status: 'published' })
    await spaceFixture.createPlanet(firstPublished.id)
    await spaceFixture.createPlanet(secondPublished.id)
    await spaceFixture.createPlanet(announced.id)

    const response = await request(honoFixture.server)
      .get('/space/galaxies')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.map((galaxy: { id: string }) => galaxy.id)).toEqual([
      firstPublished.id,
      secondPublished.id,
      announced.id,
    ])
    expect(
      response.body.some((galaxy: { id: string }) => galaxy.id === unpublished.id),
    ).toBe(false)
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        status: 'published',
        position: 1,
        planetsCount: 1,
        completedPlanetsCount: 0,
      }),
    )
    expect(response.body[2]).toEqual(
      expect.objectContaining({
        id: announced.id,
        status: 'announced',
        position: 4,
        planetsCount: null,
        completedPlanetsCount: null,
        isCurrent: false,
      }),
    )
  })

  it('should flag only the current galaxy of the authenticated account as current', async () => {
    const first = await createGalaxy({ position: 1, status: 'published' })
    const second = await createGalaxy({ position: 2, status: 'published' })
    const announced = await createGalaxy({ position: 3, status: 'announced' })
    await supabaseFixture.database
      .update(userModel)
      .set({ currentGalaxyId: second.id })
      .where(eq(userModel.id, authFixture.getAccountId()))

    const response = await request(honoFixture.server)
      .get('/space/galaxies')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(
      response.body.map((galaxy: { id: string; isCurrent: boolean }) => [
        galaxy.id,
        galaxy.isCurrent,
      ]),
    ).toEqual([
      [first.id, false],
      [second.id, true],
      [announced.id, false],
    ])
  })
})
