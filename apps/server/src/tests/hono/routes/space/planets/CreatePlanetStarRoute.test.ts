import request from 'supertest'
import { ENV } from '@/constants'
import { asc, eq, inArray } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { planetModel, starModel } from '@/database/drizzle/models/space'

import { Id } from '@stardust/core/global/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /space/planets/:planetId/stars', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const configuredGodAccounts = [...ENV.godAccountIds]
  const createdPlanetIds: string[] = []
  const createdStarIds: string[] = []

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
    createdStarIds.length = 0
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterEach(async () => {
    if (createdStarIds.length > 0) {
      await supabaseFixture.database
        .delete(starModel)
        .where(inArray(starModel.id, createdStarIds))
    }

    if (createdPlanetIds.length > 0) {
      await supabaseFixture.database
        .delete(planetModel)
        .where(inArray(planetModel.id, createdPlanetIds))
    }
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).post(
      `/space/planets/${Id.create().value}/stars`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when planet id is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/space/planets/invalid-id/stars')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'planetId', messages: ['Invalid uuid'] }]),
      }),
    )
  })
  it('should continue the shared planet star sequence across ordinary accounts', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const existing = await spaceFixture.createStar()
    createdPlanetIds.push(existing.planetId)
    createdStarIds.push(existing.id)
    await supabaseFixture.database
      .update(starModel)
      .set({ number: 1 })
      .where(eq(starModel.id, existing.id))
    const [originalStar] = await supabaseFixture.database
      .select()
      .from(starModel)
      .where(eq(starModel.id, existing.id))
    const [originalPlanet] = await supabaseFixture.database
      .select()
      .from(planetModel)
      .where(eq(planetModel.id, existing.planetId))
    expect(originalStar.number).toBe(1)
    expect(ENV.godAccountIds).toEqual([])
    for (const [index, account] of [authFixture, otherAccount].entries()) {
      const response = await request(honoFixture.server)
        .post(`/space/planets/${existing.planetId}/stars`)
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.created)
      createdStarIds.push(response.body.id)
      expect(response.body).toEqual(
        expect.objectContaining({
          name: index === 0 ? 'Nova estrela' : 'Nova estrela(1)',
          slug: index === 0 ? 'nova-estrela' : 'nova-estrela1',
          number: index + 2,
          isAvailable: false,
          isChallenge: false,
        }),
      )
      const [persisted] = await supabaseFixture.database
        .select()
        .from(starModel)
        .where(eq(starModel.id, response.body.id))
      expect(persisted).toEqual(
        expect.objectContaining({
          id: response.body.id,
          planetId: existing.planetId,
          name: index === 0 ? 'Nova estrela' : 'Nova estrela(1)',
          slug: index === 0 ? 'nova-estrela' : 'nova-estrela1',
          number: index + 2,
          isAvailable: false,
          isChallenge: false,
        }),
      )
    }
    expect(new Set(createdStarIds).size).toBe(3)
    const stars = await supabaseFixture.database
      .select()
      .from(starModel)
      .where(eq(starModel.planetId, existing.planetId))
      .orderBy(asc(starModel.number))
    expect(stars).toHaveLength(3)
    expect(stars.map((star) => star.id)).toEqual(createdStarIds)
    expect(stars.map((star) => star.number)).toEqual([1, 2, 3])
    expect(stars[0]).toEqual(originalStar)
    const [planetAfter] = await supabaseFixture.database
      .select()
      .from(planetModel)
      .where(eq(planetModel.id, existing.planetId))
    expect(planetAfter).toEqual(originalPlanet)
  })

  it('should create and persist a star for an authenticated common user', async () => {
    const existing = await spaceFixture.createStar()
    createdPlanetIds.push(existing.planetId)
    createdStarIds.push(existing.id)
    const response = await request(honoFixture.server)
      .post(`/space/planets/${existing.planetId}/stars`)
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    createdStarIds.push(response.body.id)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Nova estrela',
        number: 2,
        isAvailable: false,
        isChallenge: false,
      }),
    )
    const [persisted] = await supabaseFixture.database
      .select()
      .from(starModel)
      .where(eq(starModel.id, response.body.id))
    expect(persisted).toEqual(
      expect.objectContaining({
        id: response.body.id,
        planetId: existing.planetId,
        name: response.body.name,
        number: 2,
        slug: response.body.slug,
      }),
    )
  })
})
