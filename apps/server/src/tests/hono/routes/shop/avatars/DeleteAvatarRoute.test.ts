import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { AvatarNotFoundError } from '@stardust/core/shop/errors'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

jest.setTimeout(30000)

describe('[DELETE] /shop/avatars/:avatarId', () => {
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
    const response = await request(honoFixture.server).delete(
      `/shop/avatars/${Id.create().value}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .delete(`/shop/avatars/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when avatar id is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete('/shop/avatars/invalid-id')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'avatarId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when avatar does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete(`/shop/avatars/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AvatarNotFoundError() }),
    )
  })

  it('should delete an existing avatar', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const avatar = AvatarsFaker.fakeDto()
    await shopFixture.createAvatars([avatar])

    const response = await request(honoFixture.server)
      .delete(`/shop/avatars/${avatar.id}`)
      .set(authFixture.getAuthorizationHeader())

    const persistedAvatar = await shopFixture.getAvatarById(avatar.id as string)

    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    expect(persistedAvatar).toBeNull()
  })
})
