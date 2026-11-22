import request from 'supertest'
import { asc, inArray } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { planetModel, starModel } from '@/database/drizzle/models/space'
import { ENV } from '@/constants'
import { Id } from '@stardust/core/global/structures'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/planets', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    createdGalaxies.length = 0
    await supabaseFixture.clearDatabase()
    suspendedGalaxies = await spaceFixture.suspendExistingGalaxies()
    await authFixture.createAccount()
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
    const response = await request(honoFixture.server).get('/space/planets')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should share ordered planets and correctly grouped stars of the first galaxy only, without changing persisted rows', async () => {
    ENV.godAccountIds = []
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const firstGalaxy = await createGalaxy({ position: 1, status: 'published' })
    const secondGalaxy = await createGalaxy({ position: 2, status: 'published' })
    const first = {
      ...PlanetsFaker.fakeDto({ position: 100001, stars: [] }),
      id: Id.create().value,
    }
    const second = {
      ...PlanetsFaker.fakeDto({ position: 100002, stars: [] }),
      id: Id.create().value,
    }
    const foreign = {
      ...PlanetsFaker.fakeDto({ position: 100003, stars: [] }),
      id: Id.create().value,
    }
    const planetIds = [first.id, second.id, foreign.id]
    for (const [planet, galaxy] of [
      [second, firstGalaxy],
      [first, firstGalaxy],
      [foreign, secondGalaxy],
    ] as const) {
      await supabaseFixture.database.insert(planetModel).values({
        id: planet.id,
        name: planet.name,
        image: planet.image,
        position: planet.position,
        galaxyId: galaxy.id,
      })
    }
    const stars = [first, second, foreign].flatMap((planet) =>
      [1, 2].map((number) => ({
        ...StarsFaker.fakeDto({ number }),
        id: Id.create().value,
        planetId: planet.id,
      })),
    )
    for (const star of [...stars].reverse()) {
      await supabaseFixture.database.insert(starModel).values({
        id: star.id,
        planetId: star.planetId,
        name: star.name,
        slug: star.slug,
        number: star.number,
        isChallenge: star.isChallenge,
      })
    }
    async function readState() {
      const planets = await supabaseFixture.database
        .select()
        .from(planetModel)
        .where(inArray(planetModel.id, planetIds))
        .orderBy(asc(planetModel.id))
      const persistedStars = await supabaseFixture.database
        .select()
        .from(starModel)
        .where(inArray(starModel.planetId, planetIds))
        .orderBy(asc(starModel.planetId), asc(starModel.number))
      return { planets, stars: persistedStars }
    }
    const before = await readState()
    expect(before.planets).toHaveLength(3)
    expect(before.stars).toHaveLength(6)
    expect(ENV.godAccountIds).toEqual([])
    const projections = []
    for (const account of [authFixture, otherAccount]) {
      const response = await request(honoFixture.server)
        .get('/space/planets')
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body.map((planet: { id: string }) => planet.id)).toEqual([
        first.id,
        second.id,
      ])
      for (const [index, planet] of [first, second].entries()) {
        const expectedStars = stars.filter((star) => star.planetId === planet.id)
        expect(response.body[index].position).toBe(planet.position)
        expect(response.body[index].stars.map((star: { id: string }) => star.id)).toEqual(
          expectedStars.map((star) => star.id),
        )
        expect(
          response.body[index].stars.map((star: { number: number }) => star.number),
        ).toEqual([1, 2])
      }
      projections.push(response.body)
    }
    expect(projections[1]).toEqual(projections[0])
    expect(await readState()).toEqual(before)
  })

  it('should return persisted planets with their stars for the authenticated account', async () => {
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const star = await spaceFixture.createStar(galaxy.id)
    const response = await request(honoFixture.server)
      .get('/space/planets')
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([
      expect.objectContaining({
        id: star.planetId,
        stars: [
          expect.objectContaining({
            id: star.id,
            name: star.name,
            number: star.number,
          }),
        ],
      }),
    ])
  })
})
