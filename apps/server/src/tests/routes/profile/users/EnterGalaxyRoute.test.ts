import request from 'supertest'
import { eq } from 'drizzle-orm'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { GalaxyNotEnterableError, GalaxyNotFoundError } from '@stardust/core/space/errors'

import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import {
  userModel,
  userRecentlyUnlockedStarModel,
  userUnlockedStarModel,
} from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import {
  SpaceFixture,
  type CreatedGalaxy,
  type SuspendedGalaxy,
} from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /profile/users/current-galaxy', () => {
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

  async function readUser(userId = authFixture.getAccountId()) {
    const [user] = await supabaseFixture.database
      .select()
      .from(userModel)
      .where(eq(userModel.id, userId))
    return user
  }

  async function setCurrentGalaxy(galaxyId: string) {
    await supabaseFixture.database
      .update(userModel)
      .set({ currentGalaxyId: galaxyId })
      .where(eq(userModel.id, authFixture.getAccountId()))
  }

  function enter(galaxySlug: string, account = authFixture) {
    return request(honoFixture.server)
      .put('/profile/users/current-galaxy')
      .set(account.getAuthorizationHeader())
      .send({ galaxySlug })
  }

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put('/profile/users/current-galaxy')
      .send({ galaxySlug: 'galaxia-de-teste' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when the slug is invalid or the body has extra keys', async () => {
    const reserved = await enter('galaxies')

    expect(reserved.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(reserved.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'galaxySlug', messages: ['O slug da galáxia não pode ser "galaxies"'] },
        ]),
      }),
    )

    const extra = await request(honoFixture.server)
      .put('/profile/users/current-galaxy')
      .set(authFixture.getAuthorizationHeader())
      .send({ galaxySlug: 'galaxia-de-teste', userId: 'outra-conta' })

    expect(extra.status).toBe(HTTP_STATUS_CODE.badRequest)
  })

  it('should enter a published galaxy without changing progress or writing star rows', async () => {
    const first = await createGalaxy({ position: 1, status: 'published' })
    const target = await createGalaxy({ position: 2, status: 'published' })
    const firstStar = await spaceFixture.createStar(first.id)
    await spaceFixture.createStar(target.id)
    await setCurrentGalaxy(first.id)
    await supabaseFixture.database.insert(userUnlockedStarModel).values({
      userId: authFixture.getAccountId(),
      starId: firstStar.id,
    })
    const before = await readUser()
    const unlockedBefore = await supabaseFixture.database
      .select()
      .from(userUnlockedStarModel)
      .where(eq(userUnlockedStarModel.userId, authFixture.getAccountId()))
    expect(unlockedBefore).toHaveLength(1)

    const response = await enter(target.slug)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      currentGalaxy: { id: target.id, slug: target.slug, name: target.name },
    })
    const after = await readUser()
    expect(after.currentGalaxyId).toBe(target.id)
    expect({ ...after, currentGalaxyId: null }).toEqual({
      ...before,
      currentGalaxyId: null,
    })
    expect(after.coins).toBe(before.coins)
    expect(after.xp).toBe(before.xp)
    expect(after.level).toBe(before.level)
    expect(after.streak).toBe(before.streak)
    expect(
      await supabaseFixture.database
        .select()
        .from(userUnlockedStarModel)
        .where(eq(userUnlockedStarModel.userId, authFixture.getAccountId())),
    ).toEqual(unlockedBefore)
    expect(
      await supabaseFixture.database
        .select()
        .from(userRecentlyUnlockedStarModel)
        .where(eq(userRecentlyUnlockedStarModel.userId, authFixture.getAccountId())),
    ).toEqual([])
  })

  it('should return 409 for an announced galaxy and keep the current galaxy', async () => {
    const first = await createGalaxy({ position: 1, status: 'published' })
    const announced = await createGalaxy({ position: 2, status: 'announced' })
    await setCurrentGalaxy(first.id)

    const response = await enter(announced.slug)

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new GalaxyNotEnterableError() }),
    )
    expect((await readUser()).currentGalaxyId).toBe(first.id)
  })

  it('should return 404 for an unpublished or unknown galaxy and keep the current galaxy', async () => {
    const first = await createGalaxy({ position: 1, status: 'published' })
    const unpublished = await createGalaxy({ position: 2, status: 'unpublished' })
    await setCurrentGalaxy(first.id)

    for (const slug of [unpublished.slug, 'galaxia-inexistente']) {
      const response = await enter(slug)

      expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
      expect(response.body).toEqual(
        expect.objectContaining({ ...new GalaxyNotFoundError() }),
      )
      expect((await readUser()).currentGalaxyId).toBe(first.id)
    }
  })

  it('should change only the galaxy of the authenticated account', async () => {
    const first = await createGalaxy({ position: 1, status: 'published' })
    const target = await createGalaxy({ position: 2, status: 'published' })
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    await setCurrentGalaxy(first.id)
    await supabaseFixture.database
      .update(userModel)
      .set({ currentGalaxyId: first.id })
      .where(eq(userModel.id, otherAccount.getAccountId()))

    const response = await enter(target.slug, otherAccount)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect((await readUser(otherAccount.getAccountId())).currentGalaxyId).toBe(target.id)
    expect((await readUser()).currentGalaxyId).toBe(first.id)
  })
})
