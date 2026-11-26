import request from 'supertest'
import { eq } from 'drizzle-orm'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { userModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ChallengingFixture } from '@/tests/fixtures/ChallengingFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/users/:userId/reward/star-challenge', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const challengingFixture = new ChallengingFixture(supabaseFixture.supabase)
  const createdGalaxies: CreatedGalaxy[] = []
  let suspendedGalaxies: SuspendedGalaxy[] = []

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

  async function readHasCompletedSpace() {
    const [user] = await supabaseFixture.database
      .select({ hasCompletedSpace: userModel.hasCompletedSpace })
      .from(userModel)
      .where(eq(userModel.id, authFixture.getAccountId()))
    return user.hasCompletedSpace
  }

  async function completeLastStarChallenge(starId: string) {
    const accountId = authFixture.getAccountId()
    const challenge = await challengingFixture.createChallenge(accountId)
    await challengingFixture.createCodeExecutions([
      {
        userId: accountId,
        challengeId: challenge.id ?? '',
        code: 'correct',
        status: 'accepted',
        testResults: [],
        outputs: [],
      },
    ])
    return request(honoFixture.server)
      .put(`/profile/users/${accountId}/reward/star-challenge`)
      .set(authFixture.getAuthorizationHeader())
      .send({ challengeId: challenge.id, starId })
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put(`/profile/users/${Id.create().value}/reward/star-challenge`)
      .send({
        challengeId: Id.create().value,
        starId: Id.create().value,
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should keep has_completed_space false when the last star of a galaxy that is not the first is completed', async () => {
    await createGalaxy({ position: 1, status: 'published' })
    const secondGalaxy = await createGalaxy({ position: 2, status: 'published' })
    const lastStar = await spaceFixture.createStar(secondGalaxy.id)
    await profileFixture.openPlanet(authFixture.getAccountId(), lastStar.planetId)
    expect(await readHasCompletedSpace()).toBe(false)

    const response = await completeLastStarChallenge(lastStar.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        newCoins: expect.any(Number),
        newXp: expect.any(Number),
      }),
    )
    expect(await readHasCompletedSpace()).toBe(false)
  })

  it('should mark has_completed_space when the last star of the first galaxy is completed', async () => {
    const firstGalaxy = await createGalaxy({ position: 1, status: 'published' })
    await createGalaxy({ position: 2, status: 'published' })
    const lastStar = await spaceFixture.createStar(firstGalaxy.id)
    await profileFixture.openPlanet(authFixture.getAccountId(), lastStar.planetId)

    const response = await completeLastStarChallenge(lastStar.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(await readHasCompletedSpace()).toBe(true)
    expect(await profileFixture.countCompletedStars(authFixture.getAccountId())).toBe(1)
  })

  it('should return 403 and record nothing for a locked star', async () => {
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const star = await spaceFixture.createStar(galaxy.id)

    const response = await completeLastStarChallenge(star.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.forbidden)
    expect(await profileFixture.countCompletedStars(authFixture.getAccountId())).toBe(0)
    expect(await readHasCompletedSpace()).toBe(false)
  })

  it('should complete the available star and never record the next one', async () => {
    const accountId = authFixture.getAccountId()
    const galaxy = await createGalaxy({ position: 1, status: 'published' })
    const planet = await spaceFixture.createPlanet(galaxy.id, { position: 1 })
    const first = await spaceFixture.createStar(galaxy.id, {
      planetId: planet.id,
      number: 1,
    })
    await spaceFixture.createStar(galaxy.id, { planetId: planet.id, number: 2 })
    await profileFixture.openPlanet(accountId, planet.id)

    const response = await completeLastStarChallenge(first.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(await profileFixture.countCompletedStars(accountId)).toBe(1)
  })
})
