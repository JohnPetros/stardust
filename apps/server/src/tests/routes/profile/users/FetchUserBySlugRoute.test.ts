import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNotFoundError } from '@stardust/core/profile/errors'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'

import { ENV } from '@/constants'
import { userModel, userUnlockedAchievementModel } from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/slug/:userSlug', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const usersRepository = new DrizzleUsersRepository(supabaseFixture.database, {
    kind: 'system',
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
      '/profile/users/slug/unknown-user',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 404 when user does not exist', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users/slug/unknown-user')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
  })

  it('should read the requested cross-account profile and its own achievement projection without writing', async () => {
    const user = await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const otherUser = await profileFixture.createAccountUser(otherAccount.getAccountId())
    const first = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 1 })
    const second = AchievementsFaker.fakeUniqueDto({ id: Id.create().value, position: 2 })
    await profileFixture.createAchievements([first, second])
    await usersRepository.addUnlockedAchievement(Id.create(first.id), user.id)
    await usersRepository.addUnlockedAchievement(Id.create(second.id), otherUser.id)
    const hydratedUser = await usersRepository.findById(user.id)
    const hydratedOther = await usersRepository.findById(otherUser.id)
    if (!hydratedUser || !hydratedOther)
      throw new Error('Expected both persisted profiles')
    expect(hydratedUser.dto.slug).not.toBe(hydratedOther.dto.slug)
    expect(ENV.godAccountIds).toEqual([])
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
    expect(before.profiles).toHaveLength(2)
    expect(before.relations).toHaveLength(2)
    const cases = [
      { account: authFixture, target: hydratedOther, achievementId: second.id },
      { account: otherAccount, target: hydratedUser, achievementId: first.id },
    ]
    for (const { account, target, achievementId } of cases) {
      const response = await request(honoFixture.server)
        .get(`/profile/users/slug/${target.dto.slug}`)
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: target.dto.id,
          name: target.dto.name,
          slug: target.dto.slug,
          email: target.dto.email,
          avatar: target.dto.avatar,
          rocket: target.dto.rocket,
          tier: target.dto.tier,
        }),
      )
      expect([...response.body.unlockedAchievementsIds].sort()).toEqual([achievementId])
      expect(target.dto.unlockedAchievementsIds).toEqual([achievementId])
    }
    expect(await readState()).toEqual(before)
  })

  it('should return the requested user by slug', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server)
      .get(`/profile/users/slug/${user.dto.slug}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.dto.id,
        name: user.dto.name,
        slug: user.dto.slug,
        email: user.dto.email,
        avatar: user.dto.avatar,
        rocket: user.dto.rocket,
        tier: user.dto.tier,
      }),
    )
  })
})
