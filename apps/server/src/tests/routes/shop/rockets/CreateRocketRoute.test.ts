import { randomUUID } from 'node:crypto'
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

jest.setTimeout(30000)

describe('[POST] /shop/rockets', () => {
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
      .post('/shop/rockets')
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .post('/shop/rockets')
      .set(authFixture.getAuthorizationHeader())
      .send(RocketsFaker.fake().dto)

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post('/shop/rockets')
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

  it('should create a rocket', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const rocket = RocketsFaker.fake({
      name: `Rocket-${randomUUID()}`,
      image: `rocket-${randomUUID()}.png`,
      isSelectedByDefault: true,
    }).dto

    const response = await request(honoFixture.server)
      .post('/shop/rockets')
      .set(authFixture.getAuthorizationHeader())
      .send(rocket)

    const createdRocket = await shopFixture.getRocketById(rocket.id as string)

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      ...rocket,
      isPurchasable: true,
    })
    expect(createdRocket).toEqual({
      ...rocket,
      isPurchasable: true,
    })
  })
})
