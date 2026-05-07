import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /space/planets', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const createdPlanetIds: string[] = []

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    createdPlanetIds.length = 0
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterEach(async () => {
    if (createdPlanetIds.length > 0) {
      await supabaseFixture.supabase.from('planets').delete().in('id', createdPlanetIds)
    }
  })

  it('should return 401 when not authenticated', async () => {
    const planet = PlanetsFaker.fakeDto()

    const response = await request(honoFixture.server).post('/space/planets').send({
      name: planet.name,
      icon: planet.icon,
      image: planet.image,
    })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/space/planets')
      .set(authFixture.getAuthorizationHeader())
      .send({
        name: 'ab',
        icon: 'icon.png',
        image: 'image.png',
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['Seu nome deve conter pelo menos 3 letras'] },
        ]),
      }),
    )
  })
})
