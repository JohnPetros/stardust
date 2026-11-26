import { asc, eq, inArray } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id, InsigniaRole } from '@stardust/core/global/structures'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import {
  insigniaModel,
  userAcquiredInsigniaModel,
  userModel,
  userUnlockedAchievementModel,
} from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'

describe('[GET] /profile/users', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const usersRepository = new DrizzleUsersRepository(supabaseFixture.database, {
    kind: 'system',
  })

  const shopFixture = new ShopFixture(supabaseFixture.supabase)
  const seededInsigniaIds: string[] = []

  afterEach(async () => {
    if (!seededInsigniaIds.length) return
    await supabaseFixture.database
      .delete(userAcquiredInsigniaModel)
      .where(inArray(userAcquiredInsigniaModel.insigniaId, seededInsigniaIds))
    await supabaseFixture.database
      .delete(insigniaModel)
      .where(inArray(insigniaModel.id, seededInsigniaIds))
    seededInsigniaIds.length = 0
  })

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users?page=1&itemsPerPage=10',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when page is invalid', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users?page=0&itemsPerPage=10')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'page',
            messages: ['Number must be greater than or equal to 1'],
          },
        ]),
      }),
    )
  })

  it('should paginate ordinary users by unlocked achievement count without changing persisted state', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const prefix = `list-${Id.create().value.slice(0, 8)}`
    for (const [index, profile] of [user, otherUser].entries()) {
      await supabaseFixture.database
        .update(userModel)
        .set({ name: `${prefix}-${index}`, slug: `${prefix}-${index}` })
        .where(eq(userModel.id, profile.id.value))
    }
    const first = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 1 })
    const second = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 2 })
    await profileFixture.createAchievements([second, first])
    await usersRepository.addUnlockedAchievement(Id.create(second.id), user.id)
    await usersRepository.addUnlockedAchievement(Id.create(first.id), user.id)
    const ids = [user.id.value, otherUser.id.value]
    async function readState() {
      const profiles = await supabaseFixture.database
        .select()
        .from(userModel)
        .where(inArray(userModel.id, ids))
        .orderBy(asc(userModel.id))
      const relations = await supabaseFixture.database
        .select()
        .from(userUnlockedAchievementModel)
        .where(inArray(userUnlockedAchievementModel.userId, ids))
        .orderBy(
          asc(userUnlockedAchievementModel.userId),
          asc(userUnlockedAchievementModel.achievementId),
        )
      return { profiles, relations }
    }
    const before = await readState()
    expect(ENV.godAccountIds).toEqual([])
    expect(before.profiles).toHaveLength(2)
    expect(before.relations).toHaveLength(2)
    expect(before.relations.every((relation) => relation.userId === user.id.value)).toBe(
      true,
    )
    expect(before.relations.map((relation) => relation.achievementId).sort()).toEqual(
      [first.id, second.id].sort(),
    )
    for (const [index, profile] of [user, otherUser].entries()) {
      const response = await request(honoFixture.server)
        .get('/profile/users')
        .query({
          search: prefix,
          page: index + 1,
          itemsPerPage: 1,
          unlockedAchievementCountOrder: 'descending',
        })
        .set(authFixture.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe(
        'true',
      )
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
      expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('2')
      expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('1')
      expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe(String(index + 1))
      expect(response.body).toHaveLength(1)
      expect(response.body[0].id).toBe(profile.id.value)
      expect(response.body[0].name).toBe(`${prefix}-${index}`)
      const expectedIds = index === 0 ? [first.id, second.id].sort() : []
      expect([...response.body[0].unlockedAchievementsIds].sort()).toEqual(expectedIds)
      expect(response.body[0].unlockedAchievementsIds).toHaveLength(index === 0 ? 2 : 0)
    }
    expect(await readState()).toEqual(before)
  })

  it('should filter shared profiles by acquired engineer insignia without writing', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const prefix = `engineer-${Id.create().value.slice(0, 8)}`
    for (const [index, profile] of [user, otherUser].entries()) {
      await supabaseFixture.database
        .update(userModel)
        .set({ name: `${prefix}-${index}` })
        .where(eq(userModel.id, profile.id.value))
    }
    const engineerId = '0b4e8cd1-a6a1-4ec0-95f2-4b0c5683d7e6'
    seededInsigniaIds.push(engineerId)
    await shopFixture.createInsignias([
      InsigniasFaker.fakeDto({ id: engineerId, role: 'engineer' }),
    ])
    await usersRepository.addAcquiredInsignia(InsigniaRole.createAsEngineer(), user.id)
    const ids = [user.id.value, otherUser.id.value]
    async function readState() {
      const profiles = await supabaseFixture.database
        .select()
        .from(userModel)
        .where(inArray(userModel.id, ids))
        .orderBy(asc(userModel.id))
      const acquisitions = await supabaseFixture.database
        .select()
        .from(userAcquiredInsigniaModel)
        .where(inArray(userAcquiredInsigniaModel.userId, ids))
        .orderBy(
          asc(userAcquiredInsigniaModel.userId),
          asc(userAcquiredInsigniaModel.insigniaId),
        )
      return { profiles, acquisitions }
    }
    const before = await readState()
    expect(before.profiles).toHaveLength(2)
    expect(before.acquisitions).toEqual([
      { userId: user.id.value, insigniaId: engineerId },
    ])
    expect(ENV.godAccountIds).toEqual([])
    const baseline = await request(honoFixture.server)
      .get('/profile/users')
      .query({ search: prefix, page: 1, itemsPerPage: 10 })
      .set(authFixture.getAuthorizationHeader())
    expect(baseline.status).toBe(HTTP_STATUS_CODE.ok)
    expect(baseline.body.map((profile: { id: string }) => profile.id).sort()).toEqual(
      [...ids].sort(),
    )
    for (const account of [authFixture, otherAccount]) {
      const response = await request(honoFixture.server)
        .get('/profile/users?insigniaRoles=engineer&insigniaRoles=engineer')
        .query({ search: prefix, page: 1, itemsPerPage: 10 })
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].id).toBe(user.id.value)
      expect(response.body[0].name).toBe(`${prefix}-0`)
      expect(response.body[0].insigniaRoles).toEqual(['engineer'])
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('1')
      expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    }
    expect(await readState()).toEqual(before)
  })

  it('should include exact creation-date boundaries in shared filtered rows and totals without writing', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const prefix = `period-${Id.create().value.slice(0, 8)}`
    const dates = ['2025-01-10', '2025-01-12']
    for (const [index, profile] of [user, otherUser].entries()) {
      await supabaseFixture.database
        .update(userModel)
        .set({
          name: `${prefix}-${index}`,
          createdAt: new Date(`${dates[index]}T00:00:00.000Z`),
        })
        .where(eq(userModel.id, profile.id.value))
    }
    const ids = [user.id.value, otherUser.id.value]
    async function readProfiles() {
      return supabaseFixture.database
        .select()
        .from(userModel)
        .where(inArray(userModel.id, ids))
        .orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(2)
    expect(ENV.godAccountIds).toEqual([])
    for (const account of [authFixture, otherAccount]) {
      for (const endDate of [dates[1], dates[0]]) {
        const response = await request(honoFixture.server)
          .get('/profile/users')
          .query({
            search: prefix,
            page: 1,
            itemsPerPage: 10,
            createdAtStartDate: dates[0],
            createdAtEndDate: endDate,
          })
          .set(account.getAuthorizationHeader())
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        const expectedIds = endDate === dates[1] ? ids : [user.id.value]
        expect(response.body.map((profile: { id: string }) => profile.id).sort()).toEqual(
          [...expectedIds].sort(),
        )
        expect(response.body).toHaveLength(expectedIds.length)
        expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe(
          String(expectedIds.length),
        )
        expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
      }
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should retain totals beyond the last page and return zero totals for unmatched searches without writing', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const prefix = `empty-page-${Id.create().value}`
    const unmatched = `unmatched-${Id.create().value}`
    for (const [index, profile] of [user, otherUser].entries()) {
      await supabaseFixture.database
        .update(userModel)
        .set({ name: `${prefix}-${index}` })
        .where(eq(userModel.id, profile.id.value))
    }
    const ids = [user.id.value, otherUser.id.value]
    async function readProfiles() {
      return supabaseFixture.database
        .select()
        .from(userModel)
        .where(inArray(userModel.id, ids))
        .orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(2)
    expect(ENV.godAccountIds).toEqual([])
    const cases = [
      { search: prefix, page: 3, total: 2, pages: 2 },
      { search: unmatched, page: 1, total: 0, pages: 0 },
    ]
    for (const account of [authFixture, otherAccount]) {
      for (const scenario of cases) {
        const response = await request(honoFixture.server)
          .get('/profile/users')
          .query({ search: scenario.search, page: scenario.page, itemsPerPage: 1 })
          .set(account.getAuthorizationHeader())
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        expect(response.body).toEqual([])
        expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe(
          'true',
        )
        expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe(
          String(scenario.total),
        )
        expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe(
          String(scenario.pages),
        )
        expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe(
          String(scenario.page),
        )
        expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('1')
      }
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should return a paginated list of users', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server)
      .get('/profile/users?page=1&itemsPerPage=10')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(
      Number(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]),
    ).toBeGreaterThan(0)
    expect(
      Number(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]),
    ).toBeGreaterThan(0)
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('10')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user.dto.id,
          name: user.dto.name,
          slug: user.dto.slug,
          email: user.dto.email,
          avatar: user.dto.avatar,
          rocket: user.dto.rocket,
          tier: user.dto.tier,
        }),
      ]),
    )
  })
})
