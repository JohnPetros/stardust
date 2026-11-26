import { asc, eq } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { ENV } from '@/constants'
import { userModel } from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/created-users-kpi', () => {
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
      '/profile/users/created-users-kpi',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should expose exact global monthly counts to ordinary accounts without changing profiles', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    const olderAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await olderAccount.createAccount()
    const accounts = [authFixture, otherAccount, olderAccount]
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = now.getUTCMonth()
    for (const [offset, account] of accounts.entries()) {
      const user = await profileFixture.createAccountUser(account.getAccountId())
      await supabaseFixture.database
        .update(userModel)
        .set({ createdAt: new Date(Date.UTC(year, month - offset, 15, 12)) })
        .where(eq(userModel.id, user.id.value))
    }
    async function readProfiles() {
      return supabaseFixture.database.select().from(userModel).orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(3)
    expect(ENV.godAccountIds).toEqual([])
    for (const account of [authFixture, otherAccount]) {
      const response = await request(honoFixture.server)
        .get('/profile/users/created-users-kpi')
        .set(account.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual({
        value: 3,
        currentMonthValue: 1,
        previousMonthValue: 1,
      })
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should return created users kpi', async () => {
    const initialResponse = await request(honoFixture.server)
      .get('/profile/users/created-users-kpi')
      .set(authFixture.getAuthorizationHeader())

    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server)
      .get('/profile/users/created-users-kpi')
      .set(authFixture.getAuthorizationHeader())

    expect(initialResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        value: initialResponse.body.value + 1,
        currentMonthValue: initialResponse.body.currentMonthValue + 1,
        previousMonthValue: initialResponse.body.previousMonthValue,
      }),
    )
  })
})
