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
import { SpaceFixture } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/planets', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const createdPlanetIds: string[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    createdPlanetIds.length = 0
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterEach(async () => {
    if (createdPlanetIds.length > 0) {
      await supabaseFixture.database
        .delete(planetModel)
        .where(inArray(planetModel.id, createdPlanetIds))
    }
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/space/planets')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })
  it('should share ordered planets and correctly grouped stars without changing persisted rows', async () => {
    ENV.godAccountIds = []
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const first = {
      ...PlanetsFaker.fakeDto({ position: 100001, stars: [] }),
      id: Id.create().value,
    }
    const second = {
      ...PlanetsFaker.fakeDto({ position: 100002, stars: [] }),
      id: Id.create().value,
    }
    createdPlanetIds.push(first.id, second.id)
    for (const planet of [second, first]) {
      await supabaseFixture.database.insert(planetModel).values({
        id: planet.id,
        name: planet.name,
        image: planet.image,
        icon: planet.icon,
        position: planet.position,
      })
    }
    const stars = [first, second].flatMap((planet) =>
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
        .where(inArray(planetModel.id, createdPlanetIds))
        .orderBy(asc(planetModel.id))
      const persistedStars = await supabaseFixture.database
        .select()
        .from(starModel)
        .where(inArray(starModel.planetId, createdPlanetIds))
        .orderBy(asc(starModel.planetId), asc(starModel.number))
      return { planets, stars: persistedStars }
    }
    const before = await readState()
    expect(before.planets).toHaveLength(2)
    expect(before.stars).toHaveLength(4)
    expect(ENV.godAccountIds).toEqual([])
    const projections = []
    for (const account of [authFixture, otherAccount]) {
      const response = await request(honoFixture.server)
        .get('/space/planets')
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      const seeded = response.body.filter((planet: { id: string }) =>
        createdPlanetIds.includes(planet.id),
      )
      expect(seeded.map((planet: { id: string }) => planet.id)).toEqual([
        first.id,
        second.id,
      ])
      for (const [index, planet] of [first, second].entries()) {
        const expectedStars = stars.filter((star) => star.planetId === planet.id)
        expect(seeded[index].position).toBe(planet.position)
        expect(seeded[index].stars.map((star: { id: string }) => star.id)).toEqual(
          expectedStars.map((star) => star.id),
        )
        expect(
          seeded[index].stars.map((star: { number: number }) => star.number),
        ).toEqual([1, 2])
      }
      projections.push(seeded)
    }
    expect(projections[1]).toEqual(projections[0])
    expect(await readState()).toEqual(before)
  })

  it('should return persisted planets with their stars for the authenticated account', async () => {
    const star = await spaceFixture.createStar()
    createdPlanetIds.push(star.planetId)
    const response = await request(honoFixture.server)
      .get('/space/planets')
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: star.planetId,
          stars: expect.arrayContaining([
            expect.objectContaining({
              id: star.id,
              name: star.name,
              number: star.number,
            }),
          ]),
        }),
      ]),
    )
  })
})
