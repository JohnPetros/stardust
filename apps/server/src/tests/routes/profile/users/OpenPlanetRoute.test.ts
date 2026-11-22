import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/users/planets/:planetId/open', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []
  let firstPlanetId: string
  let secondPlanetId: string

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    createdGalaxies.length = 0
    await supabaseFixture.clearDatabase()
    suspendedGalaxies = await spaceFixture.suspendExistingGalaxies()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const galaxy = await spaceFixture.createGalaxy({ position: 1, status: 'published' })
    createdGalaxies.push(galaxy)
    const first = await spaceFixture.createPlanet(galaxy.id, { position: 1 })
    const second = await spaceFixture.createPlanet(galaxy.id, { position: 2 })
    await spaceFixture.createStar(galaxy.id, { planetId: first.id, number: 1 })
    await spaceFixture.createStar(galaxy.id, { planetId: second.id, number: 1 })
    firstPlanetId = first.id
    secondPlanetId = second.id
  })

  afterEach(async () => {
    await spaceFixture.cleanupCreatedGalaxies(createdGalaxies)
    await spaceFixture.restoreSuspendedGalaxies(suspendedGalaxies)
  })

  function open(planetId: string) {
    return request(honoFixture.server)
      .put(`/profile/users/planets/${planetId}/open`)
      .set(authFixture.getAuthorizationHeader())
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).put(
      `/profile/users/planets/${firstPlanetId}/open`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should open a liberated planet and expose it in the user facts', async () => {
    const response = await open(firstPlanetId)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ openedPlanetId: firstPlanetId })
    expect(await profileFixture.countOpenedPlanets(authFixture.getAccountId())).toBe(1)

    const user = await request(honoFixture.server)
      .get(`/profile/users/id/${authFixture.getAccountId()}`)
      .set(authFixture.getAuthorizationHeader())
    expect(user.status).toBe(HTTP_STATUS_CODE.ok)
    expect(user.body.openedPlanetsIds).toEqual([firstPlanetId])
    expect(user.body.completedStarsIds).toEqual([])
  })

  it('should be idempotent when the planet is already opened', async () => {
    await open(firstPlanetId)

    const response = await open(firstPlanetId)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ openedPlanetId: firstPlanetId })
    expect(await profileFixture.countOpenedPlanets(authFixture.getAccountId())).toBe(1)
  })

  it('should return 403 for a locked planet and 404 for an unknown one', async () => {
    const locked = await open(secondPlanetId)
    const unknown = await open(Id.create().value)

    expect(locked.status).toBe(HTTP_STATUS_CODE.forbidden)
    expect(unknown.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(await profileFixture.countOpenedPlanets(authFixture.getAccountId())).toBe(0)
  })

  it('should keep the opened planet across a new session of the same account', async () => {
    await open(firstPlanetId)

    const user = await request(honoFixture.server)
      .get(`/profile/users/id/${authFixture.getAccountId()}`)
      .set(authFixture.getAuthorizationHeader())

    expect(user.body.openedPlanetsIds).toContain(firstPlanetId)
  })

  it('should only affect the planets of the session account', async () => {
    expect((await open(firstPlanetId)).status).toBe(HTTP_STATUS_CODE.ok)
    const otherAccountId = Id.create().value

    expect(await profileFixture.countOpenedPlanets(otherAccountId)).toBe(0)
    expect(await profileFixture.countOpenedPlanets(authFixture.getAccountId())).toBe(1)
  })
})
