import request from 'supertest'
import { randomUUID } from 'node:crypto'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /shop/avatars', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const shopFixture = new ShopFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
  })

  it('should return 400 when page is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/shop/avatars?page=0&itemsPerPage=10',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'page',
            messages: ['Number must be greater than or equal to 1'],
          },
        ]),
      }),
    )
  })

  it('should return a filtered and paginated list of avatars ordered by price', async () => {
    const search = `Alpha-${randomUUID()}`
    const cheapestMatchingAvatar = AvatarsFaker.fakeDto({
      name: `${search}-Explorer`,
      price: 5,
    })
    const expensiveMatchingAvatar = AvatarsFaker.fakeDto({
      name: `${search}-Captain`,
      price: 30,
    })
    const nonMatchingAvatar = AvatarsFaker.fakeDto({
      name: 'Beta Pilot',
      price: 1,
    })

    await shopFixture.createAvatars([
      expensiveMatchingAvatar,
      cheapestMatchingAvatar,
      nonMatchingAvatar,
    ])

    const response = await request(honoFixture.server).get(
      `/shop/avatars?search=${search}&priceOrder=ascending&page=1&itemsPerPage=2`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
    expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('2')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual([
      expect.objectContaining({
        id: cheapestMatchingAvatar.id,
        name: cheapestMatchingAvatar.name,
        price: cheapestMatchingAvatar.price,
      }),
      expect.objectContaining({
        id: expensiveMatchingAvatar.id,
        name: expensiveMatchingAvatar.name,
        price: expensiveMatchingAvatar.price,
      }),
    ])
  })
})
