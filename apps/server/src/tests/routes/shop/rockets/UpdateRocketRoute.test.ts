import { randomUUID } from 'node:crypto'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { RocketNotFoundError } from '@stardust/core/shop/errors'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

jest.setTimeout(30000)

describe('[PUT] /shop/rockets/:rocketId', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const shopFixture = new ShopFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put(`/shop/rockets/${Id.create().value}`)
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .put(`/shop/rockets/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when rocket id is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put('/shop/rockets/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'rocketId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put(`/shop/rockets/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...RocketsFaker.fake().dto,
        name: 'ab',
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          { name: 'name', messages: ['Nome deve conter pelo menos 3 caracteres'] },
        ]),
      }),
    )
  })

  it('should return 404 when rocket does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put(`/shop/rockets/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new RocketNotFoundError() }),
    )
  })

  it('should update a rocket', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const existingRocket = RocketsFaker.fake({
      name: `Rocket-${randomUUID()}-current`,
      image: `rocket-${randomUUID()}-current.png`,
      isSelectedByDefault: false,
    }).dto
    await shopFixture.createRockets([existingRocket])

    const updatedRocket = RocketsFaker.fake({
      id: Id.create().value,
      name: `Rocket-${randomUUID()}-updated`,
      image: `rocket-${randomUUID()}-updated.png`,
      isSelectedByDefault: true,
    }).dto

    const response = await request(honoFixture.server)
      .put(`/shop/rockets/${existingRocket.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send(updatedRocket)

    const persistedRocket = await shopFixture.getRocketById(existingRocket.id as string)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      ...updatedRocket,
      id: existingRocket.id,
      isPurchasable: true,
    })
    expect(persistedRocket).toEqual({
      ...updatedRocket,
      id: existingRocket.id,
      isPurchasable: true,
    })
  })
})
