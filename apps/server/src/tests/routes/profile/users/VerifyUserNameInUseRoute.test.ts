import { asc, eq } from 'drizzle-orm'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNameAlreadyInUseError } from '@stardust/core/profile/errors'

import { ENV } from '@/constants'
import { userModel } from '@/database/drizzle/schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/profile'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/verify-name-in-use', () => {
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

  it('should return 400 when query name is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-name-in-use?name=ab',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['Nome deve conter pelo menos 3 caracteres'] },
        ]),
      }),
    )
  })

  it('should return 200 when name is available', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/verify-name-in-use?name=NomeDisponivel',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
  })

  it('should check exact occupied names publicly without matching prefixes or changing profiles', async () => {
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    const names = ['AvailabilityAlpha', 'AvailabilityBeta']
    for (const [index, account] of [authFixture, otherAccount].entries()) {
      const user = await profileFixture.createAccountUser(account.getAccountId())
      await supabaseFixture.database
        .update(userModel)
        .set({ name: names[index] })
        .where(eq(userModel.id, user.id.value))
    }
    async function readProfiles() {
      return supabaseFixture.database.select().from(userModel).orderBy(asc(userModel.id))
    }
    const before = await readProfiles()
    expect(before).toHaveLength(2)
    expect(before.map((profile) => profile.name).sort()).toEqual([...names].sort())
    for (const name of names) {
      const response = await request(honoFixture.server)
        .get('/profile/users/verify-name-in-use')
        .query({ name })
      expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
      expect(response.body).toEqual(
        expect.objectContaining({ ...new UserNameAlreadyInUseError() }),
      )
    }
    for (const name of ['Availability', 'AvailabilityAlphaExtended']) {
      const response = await request(honoFixture.server)
        .get('/profile/users/verify-name-in-use')
        .query({ name })
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    }
    expect(await readProfiles()).toEqual(before)
  })

  it('should return 409 when name is already in use', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const response = await request(honoFixture.server).get(
      `/profile/users/verify-name-in-use?name=${encodeURIComponent(user.dto.name)}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new UserNameAlreadyInUseError() }),
    )
  })
})
