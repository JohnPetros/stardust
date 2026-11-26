import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import {
  InsigniaAlreadyExistsError,
  InsigniaNotFoundError,
} from '@stardust/core/shop/errors'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { TestLockFixture } from '@/tests/fixtures/TestLockFixture'

jest.setTimeout(30000)

describe('[PUT] /shop/insignias/:insigniaId', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const shopFixture = new ShopFixture(supabaseFixture.supabase)
  const testLockFixture = new TestLockFixture('shop-insignias-routes')

  beforeAll(async () => {
    await testLockFixture.acquire()
    await honoFixture.setup()
  })

  afterAll(async () => {
    await testLockFixture.release()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${Id.create().value}`)
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when insignia id is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put('/shop/insignias/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'insigniaId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...InsigniasFaker.fakeDto(),
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

  it('should return 404 when insignia does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new InsigniaNotFoundError() }),
    )
  })

  it('should return 409 when updating to a role already in use', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const currentInsignia = InsigniasFaker.fakeDto({ role: 'engineer' })
    const otherInsignia = InsigniasFaker.fakeDto({ role: 'god' })
    await shopFixture.createInsignias([currentInsignia, otherInsignia])

    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${currentInsignia.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto({ role: 'god' }))

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new InsigniaAlreadyExistsError() }),
    )
  })

  it('should update an insignia', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const existingInsignia = InsigniasFaker.fakeDto({ role: 'god' })
    await shopFixture.createInsignias([existingInsignia])

    const updatedInsignia = InsigniasFaker.fakeDto({ role: 'god' })

    const response = await request(honoFixture.server)
      .put(`/shop/insignias/${existingInsignia.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send(updatedInsignia)

    const persistedInsignia = await shopFixture.getInsigniaById(
      existingInsignia.id as string,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      ...updatedInsignia,
      id: existingInsignia.id,
      isPurchasable: false,
    })
    expect(persistedInsignia).toEqual({
      ...updatedInsignia,
      id: existingInsignia.id,
      isPurchasable: false,
    })
  })
})
