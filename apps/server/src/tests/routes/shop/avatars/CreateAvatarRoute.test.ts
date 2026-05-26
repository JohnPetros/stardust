import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

jest.setTimeout(30000)

describe('[POST] /shop/avatars', () => {
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
      .post('/shop/avatars')
      .send(AvatarsFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .post('/shop/avatars')
      .set(authFixture.getAuthorizationHeader())
      .send(AvatarsFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post('/shop/avatars')
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...AvatarsFaker.fakeDto(),
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

  it('should create an avatar and replace the current selected avatar by default', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const avatar = AvatarsFaker.fakeDto({
      isSelectedByDefault: true,
    })

    const response = await request(honoFixture.server)
      .post('/shop/avatars')
      .set(authFixture.getAuthorizationHeader())
      .send(avatar)

    const createdAvatar = await shopFixture.getAvatarById(avatar.id as string)

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      ...avatar,
      isPurchasable: true,
    })
    expect(createdAvatar).toEqual(avatar)
  })
})
