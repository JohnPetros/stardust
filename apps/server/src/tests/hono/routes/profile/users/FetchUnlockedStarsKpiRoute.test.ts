import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SpaceFixture } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/unlocked-stars-kpi', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      '/profile/users/unlocked-stars-kpi',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should count the completed stars, not the old unlocked ones', async () => {
    const accountId = authFixture.getAccountId()
    await profileFixture.createAccountUser(accountId)
    const stars = [
      await spaceFixture.createStar(),
      await spaceFixture.createStar(),
      await spaceFixture.createStar(),
    ]
    for (const star of stars.slice(0, 2)) {
      await profileFixture.completeStar(accountId, star.id)
    }

    const response = await request(honoFixture.server)
      .get('/profile/users/unlocked-stars-kpi')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.value).toBe(2)
    expect(response.body.currentMonthValue).toBe(2)
    await spaceFixture.cleanupCreatedStars(stars)
  })
})
