import request from 'supertest'
import { ENV } from '@/constants'
import { asc, eq } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { planetModel } from '@/database/drizzle/models/space'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /space/planets', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const configuredGodAccounts = [...ENV.godAccountIds]
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    ENV.godAccountIds = configuredGodAccounts
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
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
    const planet = PlanetsFaker.fakeDto()

    const response = await request(honoFixture.server).post('/space/planets').send({
      name: planet.name,
      icon: planet.icon,
      image: planet.image,
    })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/space/planets')
      .set(authFixture.getAuthorizationHeader())
      .send({
        name: 'ab',
        icon: 'icon.png',
        image: 'image.png',
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['Nome deve conter pelo menos 3 caracteres'] },
        ]),
      }),
    )
  })
  it('should allocate sequential positions in the first galaxy only for ordinary accounts', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const firstGalaxy = await createGalaxy({ position: 1, status: 'published' })
    const secondGalaxy = await createGalaxy({ position: 2, status: 'published' })
    await spaceFixture.createPlanet(firstGalaxy.id, { position: 3 })
    await spaceFixture.createPlanet(firstGalaxy.id, { position: 1 })
    await spaceFixture.createPlanet(secondGalaxy.id, { position: 9 })
    async function readPlanets(galaxyId: string) {
      return supabaseFixture.database
        .select()
        .from(planetModel)
        .where(eq(planetModel.galaxyId, galaxyId))
        .orderBy(asc(planetModel.id))
    }
    const secondGalaxyBefore = await readPlanets(secondGalaxy.id)
    const firstGalaxyBefore = await readPlanets(firstGalaxy.id)
    expect(ENV.godAccountIds).toEqual([])
    const addedIds: string[] = []
    for (const [index, account] of [authFixture, otherAccount].entries()) {
      const dto = PlanetsFaker.fakeDto()
      const payload = { name: dto.name, icon: dto.icon, image: dto.image }
      const response = await request(honoFixture.server)
        .post('/space/planets')
        .set(account.getAuthorizationHeader())
        .send(payload)
      expect(response.status).toBe(HTTP_STATUS_CODE.created)
      addedIds.push(response.body.id)
      expect(response.body).toEqual({
        id: response.body.id,
        ...payload,
        position: 3 + index + 1,
        galaxyId: firstGalaxy.id,
        isAvailable: false,
        stars: [],
        completionCount: 0,
        userCount: 0,
      })
      const [persisted] = await supabaseFixture.database
        .select()
        .from(planetModel)
        .where(eq(planetModel.id, response.body.id))
      expect(persisted).toEqual({
        id: response.body.id,
        ...payload,
        position: 3 + index + 1,
        isAvailable: false,
        galaxyId: firstGalaxy.id,
      })
    }
    expect(new Set(addedIds).size).toBe(2)
    const firstGalaxyAfter = await readPlanets(firstGalaxy.id)
    expect(firstGalaxyAfter.filter((planet) => !addedIds.includes(planet.id))).toEqual(
      firstGalaxyBefore,
    )
    expect(firstGalaxyAfter).toHaveLength(firstGalaxyBefore.length + 2)
    expect(firstGalaxyAfter.map((planet) => planet.position).sort()).toEqual([1, 3, 4, 5])
    expect(await readPlanets(secondGalaxy.id)).toEqual(secondGalaxyBefore)
    expect(secondGalaxyBefore.map((planet) => planet.position)).toEqual([9])
  })

  it('should create and persist a shared planet for an authenticated common user', async () => {
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const planet = PlanetsFaker.fakeDto()
    const payload = { name: planet.name, icon: planet.icon, image: planet.image }
    const response = await request(honoFixture.server)
      .post('/space/planets')
      .set(authFixture.getAuthorizationHeader())
      .send(payload)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({ ...payload, stars: [], isAvailable: false, position: 1 }),
    )
    const [persisted] = await supabaseFixture.database
      .select()
      .from(planetModel)
      .where(eq(planetModel.id, response.body.id))
    expect(persisted).toEqual(
      expect.objectContaining({
        id: response.body.id,
        ...payload,
        position: response.body.position,
        galaxyId: galaxy.id,
      }),
    )
  })
})
