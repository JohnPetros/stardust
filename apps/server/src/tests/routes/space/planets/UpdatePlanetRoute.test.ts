import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { PlanetNotFoundError } from '@stardust/core/space/errors'
import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { SupabasePlanetsRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT] /space/planets/:planetId', () => {
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
      .put(`/space/planets/${Id.create().value}`)
      .send({ name: 'Planeta Atualizado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when planet id is invalid', async () => {
    const response = await request(honoFixture.server)
      .put('/space/planets/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send({ name: 'Planeta Atualizado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'planetId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when planet does not exist', async () => {
    const response = await request(honoFixture.server)
      .put(`/space/planets/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ name: 'Planeta Atualizado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new PlanetNotFoundError() }),
    )
  })

  it('should update a planet', async () => {
    const planet = PlanetsFaker.fake({
      name: 'Planeta Original',
      position: 1,
      stars: [],
      completionCount: 0,
      userCount: 0,
      isAvailable: false,
    })
    await planetsRepository.add(planet)

    const response = await request(honoFixture.server)
      .put(`/space/planets/${planet.id.value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({
        name: 'Planeta Atualizado',
        icon: 'updated-icon.png',
      })

    const updatedPlanet = await planetsRepository.findById(planet.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: planet.id.value,
        name: 'Planeta Atualizado',
        icon: 'updated-icon.png',
        image: planet.image.value,
        position: 1,
      }),
    )
    expect(updatedPlanet?.dto).toEqual(
      expect.objectContaining({
        id: planet.id.value,
        name: 'Planeta Atualizado',
        icon: 'updated-icon.png',
      }),
    )
  })
})
