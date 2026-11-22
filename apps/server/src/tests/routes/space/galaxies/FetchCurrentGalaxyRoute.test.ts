import request from 'supertest'
import { eq } from 'drizzle-orm'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { GalaxyNotFoundError } from '@stardust/core/space/errors'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { galaxyModel, userModel, userCompletedStarModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /space/galaxies/current', () => {
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

  async function readStoredGalaxyId() {
    const [user] = await supabaseFixture.database
      .select({ currentGalaxyId: userModel.currentGalaxyId })
      .from(userModel)
      .where(eq(userModel.id, authFixture.getAccountId()))
    return user.currentGalaxyId
  }

  async function setStoredGalaxyId(galaxyId: string) {
    await supabaseFixture.database
      .update(userModel)
      .set({ currentGalaxyId: galaxyId })
      .where(eq(userModel.id, authFixture.getAccountId()))
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/space/galaxies/current')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return the stored published galaxy of the authenticated account', async () => {
    await createGalaxy({ position: 1, status: 'published' })
    const second = await createGalaxy({ position: 2, status: 'published' })
    await setStoredGalaxyId(second.id)

    const response = await request(honoFixture.server)
      .get('/space/galaxies/current')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      galaxy: { id: second.id, slug: second.slug, name: second.name },
      isFirstGalaxy: false,
      hasGalaxyChoice: true,
    })
    expect(await readStoredGalaxyId()).toBe(second.id)
  })

  it('should resolve and persist the first published galaxy when the account has no current galaxy', async () => {
    await createGalaxy({ position: 1, status: 'announced' })
    const secondPublished = await createGalaxy({ position: 3, status: 'published' })
    const firstPublished = await createGalaxy({ position: 2, status: 'published' })
    expect(await readStoredGalaxyId()).toBeNull()

    const response = await request(honoFixture.server)
      .get('/space/galaxies/current')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      galaxy: {
        id: firstPublished.id,
        slug: firstPublished.slug,
        name: firstPublished.name,
      },
      isFirstGalaxy: false,
      hasGalaxyChoice: true,
    })
    expect(secondPublished.id).not.toBe(firstPublished.id)
    expect(await readStoredGalaxyId()).toBe(firstPublished.id)
  })

  it.each(['announced', 'unpublished'] as const)(
    'should replace a current galaxy that became %s and keep its completed stars',
    async (status) => {
      const first = await createGalaxy({ position: 1, status: 'published' })
      const withdrawn = await createGalaxy({ position: 2, status: 'published' })
      const star = await spaceFixture.createStar(withdrawn.id)
      await supabaseFixture.database.insert(userCompletedStarModel).values({
        userId: authFixture.getAccountId(),
        starId: star.id,
      })
      await setStoredGalaxyId(withdrawn.id)
      await supabaseFixture.database
        .update(galaxyModel)
        .set({ status })
        .where(eq(galaxyModel.id, withdrawn.id))

      const response = await request(honoFixture.server)
        .get('/space/galaxies/current')
        .set(authFixture.getAuthorizationHeader())

      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body.galaxy).toEqual({
        id: first.id,
        slug: first.slug,
        name: first.name,
      })
      expect(response.body.isFirstGalaxy).toBe(true)
      expect(await readStoredGalaxyId()).toBe(first.id)
      const completedStars = await supabaseFixture.database
        .select()
        .from(userCompletedStarModel)
        .where(eq(userCompletedStarModel.userId, authFixture.getAccountId()))
      expect(completedStars.map((completed) => completed.starId)).toEqual([star.id])
    },
  )

  it('should return 404 without writing when there is no published galaxy', async () => {
    const announced = await createGalaxy({ position: 1, status: 'announced' })
    await createGalaxy({ position: 2, status: 'unpublished' })
    await setStoredGalaxyId(announced.id)

    const response = await request(honoFixture.server)
      .get('/space/galaxies/current')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new GalaxyNotFoundError() }),
    )
    expect(await readStoredGalaxyId()).toBe(announced.id)
  })
})
