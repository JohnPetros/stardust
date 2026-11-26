import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { GalaxyNotFoundError } from '@stardust/core/space/errors'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/galaxies/:galaxySlug/planets', () => {
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
    await spaceFixture.restoreAllSuspendedGalaxies()
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
    const response = await request(honoFixture.server).get(
      '/space/galaxies/any-galaxy/planets',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when the slug is the reserved galaxies segment', async () => {
    const response = await request(honoFixture.server)
      .get('/space/galaxies/galaxies/planets')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'galaxySlug', messages: ['O slug da galáxia não pode ser "galaxies"'] },
        ]),
      }),
    )
  })

  it('should return only the planets of the requested published galaxy with their stars', async () => {
    const other = await createGalaxy({ position: 1, status: 'published' })
    const galaxy = await createGalaxy({ position: 2, status: 'published' })
    await spaceFixture.createStar(other.id)
    const firstStar = await spaceFixture.createStar(galaxy.id)
    const secondStar = await spaceFixture.createStar(galaxy.id)

    const response = await request(honoFixture.server)
      .get(`/space/galaxies/${galaxy.slug}/planets`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toHaveLength(2)
    expect(response.body.map((planet: { id: string }) => planet.id).sort()).toEqual(
      [firstStar.planetId, secondStar.planetId].sort(),
    )
    const positions = response.body.map((planet: { position: number }) => planet.position)
    expect(positions).toEqual([...positions].sort((a: number, b: number) => a - b))
    for (const star of [firstStar, secondStar]) {
      const planet = response.body.find(
        (item: { id: string }) => item.id === star.planetId,
      )
      expect(planet.stars).toEqual([
        expect.objectContaining({ id: star.id, name: star.name, number: star.number }),
      ])
    }
  })

  it('should expose the planet concept and the star description, null when absent', async () => {
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const withContent = await spaceFixture.createPlanet(galaxy.id, {
      position: 1,
      concept: 'Variáveis',
    })
    const withoutContent = await spaceFixture.createPlanet(galaxy.id, { position: 2 })
    const described = await spaceFixture.createStar(galaxy.id, {
      planetId: withContent.id,
      number: 1,
      description: 'Estrela de história sobre variáveis.',
    })
    const plain = await spaceFixture.createStar(galaxy.id, {
      planetId: withoutContent.id,
      number: 1,
    })

    const response = await request(honoFixture.server)
      .get(`/space/galaxies/${galaxy.slug}/planets`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    const [first, second] = response.body
    expect(first.concept).toBe('Variáveis')
    expect(first.stars[0]).toEqual(
      expect.objectContaining({
        id: described.id,
        description: 'Estrela de história sobre variáveis.',
      }),
    )
    expect(second.concept).toBeNull()
    expect(second.stars[0]).toEqual(
      expect.objectContaining({ id: plain.id, description: null }),
    )
  })

  it('should return 404 for announced, unpublished and unknown galaxies', async () => {
    const announced = await createGalaxy({ position: 1, status: 'announced' })
    const unpublished = await createGalaxy({ position: 2, status: 'unpublished' })
    await spaceFixture.createPlanet(announced.id)
    await spaceFixture.createPlanet(unpublished.id)

    for (const slug of [announced.slug, unpublished.slug, 'galaxia-inexistente']) {
      const response = await request(honoFixture.server)
        .get(`/space/galaxies/${slug}/planets`)
        .set(authFixture.getAuthorizationHeader())

      expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
      expect(response.body).toEqual(
        expect.objectContaining({ ...new GalaxyNotFoundError() }),
      )
    }
  })
})
