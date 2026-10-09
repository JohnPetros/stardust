import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNotFoundError } from '@stardust/core/profile/errors'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { ENV } from '@/constants'
import { userModel } from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/id/:userId', () => {
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
      `/profile/users/id/${Id.create().value}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 404 when user does not exist', async () => {
    const response = await request(honoFixture.server)
      .get(`/profile/users/id/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
  })

  it('should not expose a different user by id', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    const response = await request(honoFixture.server)
      .get(`/profile/users/id/${otherAccount.getAccountId()}`)
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
  })

  it('should return each own persisted profile and conceal reciprocal foreign IDs without writing', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))
    const otherUser = await usersRepository.findById(
      Id.create(otherAccount.getAccountId()),
    )
    if (!user || !otherUser) throw new Error('Expected both persisted profiles')
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
      { account: authFixture, own: user, foreign: otherUser },
      { account: otherAccount, own: otherUser, foreign: user },
    ]
    for (const { account, own, foreign } of cases) {
      const self = await request(honoFixture.server)
        .get(`/profile/users/id/${own.id.value}`)
        .set(account.getAuthorizationHeader())
      expect(self.status).toBe(HTTP_STATUS_CODE.ok)
      expect(self.body).toEqual(JSON.parse(JSON.stringify(own.dto)))
      const denied = await request(honoFixture.server)
        .get(`/profile/users/id/${foreign.id.value}`)
        .set(account.getAuthorizationHeader())
      expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
      expect(denied.body).toEqual({ ...new UserNotFoundError() })
      for (const field of ['id', 'name', 'email', 'slug', 'avatar', 'rocket', 'tier']) {
        expect(denied.body).not.toHaveProperty(field)
      }
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should return the requested user by id', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server)
      .get(`/profile/users/id/${user.dto.id}`)
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
