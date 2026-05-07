import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ConflictError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { PlanetNotFoundError } from '@stardust/core/space/errors'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'

import { SupabasePlanetsRepository, SupabaseStarsRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /space/planets/:planetId/stars', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const planetsRepository = new SupabasePlanetsRepository(supabaseFixture.supabase)
  const starsRepository = new SupabaseStarsRepository(supabaseFixture.supabase)

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
      .patch(`/space/planets/${Id.create().value}/stars`)
      .send({ starIds: [] })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when route params are invalid', async () => {
    const response = await request(honoFixture.server)
      .patch('/space/planets/invalid-id/stars')
      .set(authFixture.getAuthorizationHeader())
      .send({ starIds: [Id.create().value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'planetId', messages: ['Invalid uuid'] }]),
      }),
    )
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

    const star = StarsFaker.fake({
      number: 1,
      isAvailable: false,
      isChallenge: false,
      userCount: 0,
      unlockCount: 0,
    })
    await starsRepository.add(star, planet.id)

    const response = await request(honoFixture.server)
      .patch(`/space/planets/${planet.id.value}/stars`)
      .set(authFixture.getAuthorizationHeader())
      .send({ starIds: [star.id.value, star.id.value] })

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ConflictError('Todos os IDs das estrelas devem ser fornecidos e únicos'),
      }),
    )
  })

  it('should return 404 when planet does not exist', async () => {
    const response = await request(honoFixture.server)
      .patch(`/space/planets/${Id.create().value}/stars`)
      .set(authFixture.getAuthorizationHeader())
      .send({ starIds: [] })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new PlanetNotFoundError() }),
    )
  })
})
