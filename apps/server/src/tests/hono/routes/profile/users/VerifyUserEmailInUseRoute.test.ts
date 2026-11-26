import { asc, eq } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserEmailAlreadyInUseError } from '@stardust/core/profile/errors'

import { ENV } from '@/constants'
import { userModel } from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/verify-email-in-use', () => {
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

  it('should return 400 when query email is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-email-in-use?email=invalid-email',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'email', messages: ['Informe um e-mail válido'] },
        ]),
      }),
    )
  })

  it('should return 200 when email is available', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-email-in-use?email=available@stardust.dev',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
  })

  it('should check complete email addresses publicly without changing profiles', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const emails = ['availability@example.com', 'availability@example.net']
    for (const [index, account] of [authFixture, otherAccount].entries()) {
      const user = await profileFixture.createAccountUser(account.getAccountId())
      await supabaseFixture.database
        .update(userModel)
        .set({ email: emails[index] })
        .where(eq(userModel.id, user.id.value))
    }
    async function readProfiles() {
      return supabaseFixture.database.select().from(userModel).orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(2)
    expect(before.map((profile) => profile.email).sort()).toEqual([...emails].sort())
    for (const email of emails) {
      const response = await request(honoFixture.server)
        .get('/profile/users/verify-email-in-use')
        .query({ email })
      expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
      expect(response.body).toEqual(
        expect.objectContaining({ ...new UserEmailAlreadyInUseError() }),
      )
    }
    for (const email of [
      'availability@example.org',
      'availabilityextended@example.com',
    ]) {
      const response = await request(honoFixture.server)
        .get('/profile/users/verify-email-in-use')
        .query({ email })
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should return 409 when email is already in use', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server).get(
      `/profile/users/verify-email-in-use?email=${encodeURIComponent(user.dto.email)}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new UserEmailAlreadyInUseError() }),
    )
  })
})
