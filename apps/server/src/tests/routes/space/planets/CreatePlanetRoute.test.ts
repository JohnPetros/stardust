import request from 'supertest'
import { ENV } from '@/constants'
import { asc, eq, inArray } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { planetModel } from '@/database/drizzle/models/space'

import { Id } from '@stardust/core/global/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /space/planets', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const configuredGodAccounts = [...ENV.godAccountIds]
  const createdPlanetIds: string[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    ENV.godAccountIds = configuredGodAccounts
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
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
  it('should allocate sequential positions from the persisted maximum for ordinary accounts', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    async function readPlanets() {
      return supabaseFixture.database
        .select()
        .from(planetModel)
        .orderBy(asc(planetModel.id))
    }
    const initial = await readPlanets()
    const initialMax = Math.max(0, ...initial.map((planet) => planet.position))
    for (const position of [initialMax + 3, initialMax + 1]) {
      const seed = PlanetsFaker.fakeDto({ position, stars: [] })
      const id = Id.create().value
      createdPlanetIds.push(id)
      await supabaseFixture.database.insert(planetModel).values({
        id,
        name: seed.name,
        icon: seed.icon,
        image: seed.image,
        position,
      })
    }
    const before = await readPlanets()
    const seedMax = Math.max(...before.map((planet) => planet.position))
    expect(seedMax).toBe(initialMax + 3)
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
      createdPlanetIds.push(response.body.id)
      addedIds.push(response.body.id)
      expect(response.body).toEqual({
        id: response.body.id,
        ...payload,
        position: seedMax + index + 1,
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
        position: seedMax + index + 1,
        isAvailable: false,
      })
    }
    expect(new Set(addedIds).size).toBe(2)
    const after = await readPlanets()
    expect(after.filter((planet) => !addedIds.includes(planet.id))).toEqual(before)
    expect(
      after
        .filter((planet) => addedIds.includes(planet.id))
        .map((planet) => planet.id)
        .sort(),
    ).toEqual([...addedIds].sort())
    expect(after).toHaveLength(before.length + 2)
  })

  it('should create and persist a shared planet for an authenticated common user', async () => {
    const planet = PlanetsFaker.fakeDto()
    const payload = { name: planet.name, icon: planet.icon, image: planet.image }
    const response = await request(honoFixture.server)
      .post('/space/planets')
      .set(authFixture.getAuthorizationHeader())
      .send(payload)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    createdPlanetIds.push(response.body.id)
    expect(response.body).toEqual(
      expect.objectContaining({ ...payload, stars: [], isAvailable: false }),
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
      }),
    )
  })
})
