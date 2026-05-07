import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { InsigniaAlreadyExistsError } from '@stardust/core/shop/errors'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { TestLockFixture } from '@/tests/fixtures/TestLockFixture'

jest.setTimeout(30000)

describe('[POST] /shop/insignias', () => {
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
      .post('/shop/insignias')
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .post('/shop/insignias')
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post('/shop/insignias')
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...InsigniasFaker.fakeDto(),
        name: 'ab',
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

  it('should return 409 when role is already in use', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const existingInsignia = InsigniasFaker.fakeDto({ role: 'engineer' })
    await shopFixture.createInsignias([existingInsignia])

    const response = await request(honoFixture.server)
      .post('/shop/insignias')
      .set(authFixture.getAuthorizationHeader())
      .send(InsigniasFaker.fakeDto({ role: 'engineer' }))

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new InsigniaAlreadyExistsError() }),
    )
  })

  it('should create an insignia', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const currentInsigniasResponse = await supabaseFixture.supabase
      .from('insignias')
      .select('role')

    if (currentInsigniasResponse.error) {
      throw currentInsigniasResponse.error
    }

    const currentRoles = new Set(
      currentInsigniasResponse.data.map((insignia) => insignia.role),
    )
    const roleToCreate = currentRoles.has('engineer') ? 'engineer' : 'god'

    supabaseFixture.deleteInsigniaByRole(roleToCreate)

    const insignia = InsigniasFaker.fakeDto({ role: roleToCreate })

    const response = await request(honoFixture.server)
      .post('/shop/insignias')
      .set(authFixture.getAuthorizationHeader())
      .send(insignia)

    const createdInsignia = await shopFixture.getInsigniaById(insignia.id as string)

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      ...insignia,
      isPurchasable: false,
    })
    expect(createdInsignia).toEqual({
      ...insignia,
      isPurchasable: false,
    })
  })
})
