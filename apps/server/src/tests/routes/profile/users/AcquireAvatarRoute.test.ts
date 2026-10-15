import request from 'supertest'
import { eq } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { outboxEventModel } from '@/database/drizzle/models/global/outbox-event-model'
import { userModel, userAcquiredAvatarModel } from '@/database/drizzle/models/profile'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { UserNotFoundError } from '@stardust/core/profile/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /profile/users/avatars/acquire', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  const profile = new ProfileFixture(supabaseFixture.supabase)
  const shop = new ShopFixture(supabaseFixture.supabase)

  afterAll(async () => {
    await DrizzleClient.close()
  })

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
      .post('/profile/users/avatars/acquire')
      .send({
        avatarId: Id.create().value,
        avatarName: 'Avatar Test',
        avatarImage: 'avatar.png',
        avatarPrice: 10,
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 404 when authenticated account has no profile user', async () => {
    const response = await request(honoFixture.server)
      .post('/profile/users/avatars/acquire')
      .set(authFixture.getAuthorizationHeader())
      .send({
        avatarId: Id.create().value,
        avatarName: 'Avatar Test',
        avatarImage: 'avatar.png',
        avatarPrice: 10,
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(expect.objectContaining({ ...new UserNotFoundError() }))
  })

  const preparePurchase = async () => {
    const userId = authFixture.getAccountId()
    await profile.createAccountUser(userId)
    await supabaseFixture.database
      .update(userModel)
      .set({ coins: 100 })
      .where(eq(userModel.id, userId))
    const avatar = AvatarsFaker.fakeDto({ price: 10 })
    await shop.createAvatars([avatar])
    return {
      userId,
      avatar,
      body: {
        avatarId: avatar.id,
        avatarName: avatar.name,
        avatarImage: avatar.image,
        avatarPrice: avatar.price,
      },
    }
  }

  it('commits purchased inventory, coins and the durable event together', async () => {
    const { userId, avatar, body } = await preparePurchase()
    const response = await request(honoFixture.server)
      .post('/profile/users/avatars/acquire')
      .set(authFixture.getAuthorizationHeader())
      .send(body)
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(await profile.getUserCoins(userId)).toBe(90)
    expect(await supabaseFixture.database.select().from(userAcquiredAvatarModel)).toEqual(
      [expect.objectContaining({ userId, avatarId: avatar.id })],
    )
    expect(await supabaseFixture.database.select().from(outboxEventModel)).toEqual([
      expect.objectContaining({
        status: 'pending',
        payload: expect.objectContaining({
          userId,
          itemId: avatar.id,
          itemType: 'avatar',
        }),
      }),
    ])
  })

  it('rolls back purchased inventory and coins when durable enqueue fails', async () => {
    const { userId, body } = await preparePurchase()
    const enqueue = InngestBroker.prototype.publish
    const delivery = jest
      .spyOn(InngestBroker.prototype, 'publish')
      .mockImplementation(async function (this: InngestBroker, event, id) {
        await enqueue.call(this, event, id)
        throw new Error('Controlled enqueue failure')
      })
    const errors = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      const response = await request(honoFixture.server)
        .post('/profile/users/avatars/acquire')
        .set(authFixture.getAuthorizationHeader())
        .send(body)
      expect(response.status).toBe(HTTP_STATUS_CODE.serverError)
      expect(await profile.getUserCoins(userId)).toBe(100)
      expect(
        await supabaseFixture.database.select().from(userAcquiredAvatarModel),
      ).toEqual([])
      expect(await supabaseFixture.database.select().from(outboxEventModel)).toEqual([])
    } finally {
      delivery.mockRestore()
      errors.mockRestore()
    }
  })
})
