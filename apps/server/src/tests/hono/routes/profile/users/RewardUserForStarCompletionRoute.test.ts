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

describe('[PUT] /profile/users/:userId/reward/star', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []
  let planetId: string
  let starIds: string[]

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
    const planet = await spaceFixture.createPlanet(galaxy.id, { position: 1 })
    const nextPlanet = await spaceFixture.createPlanet(galaxy.id, { position: 2 })
    planetId = planet.id
    starIds = []
    for (const number of [1, 2, 3, 4]) {
      const star = await spaceFixture.createStar(galaxy.id, { planetId, number })
      starIds.push(star.id)
    }
    await spaceFixture.createStar(galaxy.id, { planetId: nextPlanet.id, number: 1 })
  })

  afterEach(async () => {
    await spaceFixture.cleanupCreatedGalaxies(createdGalaxies)
    await spaceFixture.restoreSuspendedGalaxies(suspendedGalaxies)
  })

  function reward(starId: string, userId = authFixture.getAccountId()) {
    return request(honoFixture.server)
      .put(`/profile/users/${userId}/reward/star`)
      .set(authFixture.getAuthorizationHeader())
      .send({ starId, questionsCount: 10, incorrectAnswersCount: 0 })
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put(`/profile/users/${Id.create().value}/reward/star`)
      .send({
        starId: Id.create().value,
        questionsCount: 10,
        incorrectAnswersCount: 1,
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 403 and reward nothing for a locked star', async () => {
    await profileFixture.openPlanet(authFixture.getAccountId(), planetId)
    const coinsBefore = await profileFixture.getUserCoins(authFixture.getAccountId())

    const response = await reward(starIds[1])

    expect(response.status).toBe(HTTP_STATUS_CODE.forbidden)
    expect(await profileFixture.countCompletedStars(authFixture.getAccountId())).toBe(0)
    expect(await profileFixture.getUserCoins(authFixture.getAccountId())).toBe(
      coinsBefore,
    )
  })

  it('should complete the available star once and pay half on the repetition', async () => {
    await profileFixture.openPlanet(authFixture.getAccountId(), planetId)

    const first = await reward(starIds[0])
    const second = await reward(starIds[0])

    expect(first.status).toBe(HTTP_STATUS_CODE.ok)
    expect(second.status).toBe(HTTP_STATUS_CODE.ok)
    expect(second.body.newCoins).toBe(first.body.newCoins / 2)
    expect(second.body.newXp).toBe(first.body.newXp / 2)
    expect(await profileFixture.countCompletedStars(authFixture.getAccountId())).toBe(1)
  })

  it('should never record the next star and complete the planet on its last star', async () => {
    const accountId = authFixture.getAccountId()
    await profileFixture.openPlanet(accountId, planetId)
    for (const starId of starIds.slice(0, 3))
      await profileFixture.completeStar(accountId, starId)

    const response = await reward(starIds[3])

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(await profileFixture.countCompletedStars(accountId)).toBe(4)
    expect(await profileFixture.countOpenedPlanets(accountId)).toBe(1)
  })

  it('should return 404 and record nothing when the user id is another account', async () => {
    await profileFixture.openPlanet(authFixture.getAccountId(), planetId)

    const response = await reward(starIds[0], Id.create().value)

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(await profileFixture.countCompletedStars(authFixture.getAccountId())).toBe(0)
  })
})
