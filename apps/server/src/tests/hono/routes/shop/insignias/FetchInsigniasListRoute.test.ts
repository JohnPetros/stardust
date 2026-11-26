import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { TestLockFixture } from '@/tests/fixtures/TestLockFixture'

describe('[GET] /shop/insignias', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
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
    await supabaseFixture.clearDatabase()
  })

  it('should return only purchasable insignias', async () => {
    supabaseFixture.deleteInsigniaByRole('engineer')

    const purchasableInsignia = InsigniasFaker.fakeDto({
      role: 'engineer',
      isPurchasable: true,
    })

    await shopFixture.createInsignias([purchasableInsignia])

    const response = await request(honoFixture.server).get('/shop/insignias')

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([
      expect.objectContaining({
        id: purchasableInsignia.id,
        name: purchasableInsignia.name,
        image: purchasableInsignia.image,
        price: purchasableInsignia.price,
        role: purchasableInsignia.role,
        isPurchasable: true,
      }),
    ])
  })
})
