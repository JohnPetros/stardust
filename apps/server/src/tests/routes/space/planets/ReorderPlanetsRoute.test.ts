import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ConflictError, ValidationError } from '@stardust/core/global/errors'
import { PlanetNotFoundError } from '@stardust/core/space/errors'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { SupabasePlanetsRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /space/planets/order', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const planetsRepository = new SupabasePlanetsRepository(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.supabase.from('stars').delete()
    await supabaseFixture.supabase.from('planets').delete()
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .patch('/space/planets/order')
      .send({ planetIds: [] })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    const response = await request(honoFixture.server)
      .patch('/space/planets/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ planetIds: [123] })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(expect.objectContaining({ ...new ValidationError([]) }))
  })

  it('should return 409 when payload contains duplicate ids', async () => {
    const planet = PlanetsFaker.fake({
      position: 1,
      stars: [],
      completionCount: 0,
      userCount: 0,
      isAvailable: false,
    })
    await planetsRepository.add(planet)

    const response = await request(honoFixture.server)
      .patch('/space/planets/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ planetIds: [planet.id.value, planet.id.value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ConflictError('Todos os IDs dos planetas devem ser fornecidos e únicos'),
      }),
    )
  })

  it('should return 404 when any planet does not exist', async () => {
    const planet = PlanetsFaker.fake({
      position: 1,
      stars: [],
      completionCount: 0,
      userCount: 0,
      isAvailable: false,
    })
    await planetsRepository.add(planet)

    const response = await request(honoFixture.server)
      .patch('/space/planets/order')
      .set(authFixture.getAuthorizationHeader())
      .send({ planetIds: [planet.id.value, PlanetsFaker.fake().id.value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new PlanetNotFoundError() }),
    )
  })
})
