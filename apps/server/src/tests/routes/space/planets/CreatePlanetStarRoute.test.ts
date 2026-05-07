import request from 'supertest'

import { Id } from '@stardust/core/global/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /space/planets/:planetId/stars', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const createdPlanetIds: string[] = []
  const createdStarIds: string[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    createdPlanetIds.length = 0
    createdStarIds.length = 0
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterEach(async () => {
    if (createdStarIds.length > 0) {
      await supabaseFixture.supabase.from('stars').delete().in('id', createdStarIds)
    }

    if (createdPlanetIds.length > 0) {
      await supabaseFixture.supabase.from('planets').delete().in('id', createdPlanetIds)
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
})
