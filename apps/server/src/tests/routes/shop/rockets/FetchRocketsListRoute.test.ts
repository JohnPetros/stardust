import { randomUUID } from 'node:crypto'
import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ShopFixture } from '@/tests/fixtures/ShopFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /shop/rockets', () => {
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
      '/shop/rockets?page=0&itemsPerPage=10',
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

  it('should return a filtered and paginated list of rockets ordered by price', async () => {
    const search = `Rocket-${randomUUID()}`
    const cheapestMatchingRocket = RocketsFaker.fake({
      name: `${search}-Scout`,
      image: `rocket-${randomUUID()}-scout.png`,
      price: 5,
    }).dto
    const expensiveMatchingRocket = RocketsFaker.fake({
      name: `${search}-Titan`,
      image: `rocket-${randomUUID()}-titan.png`,
      price: 30,
    }).dto
    const nonMatchingRocket = RocketsFaker.fake({
      name: `Beta-${randomUUID()}-Shuttle`,
      image: `rocket-${randomUUID()}-beta.png`,
      price: 1,
    }).dto

    await shopFixture.createRockets([
      expensiveMatchingRocket,
      cheapestMatchingRocket,
      nonMatchingRocket,
    ])

    const response = await request(honoFixture.server).get(
      `/shop/rockets?search=${search}&priceOrder=ascending&page=1&itemsPerPage=2`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
    expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('2')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual([
      expect.objectContaining({
        id: cheapestMatchingRocket.id,
        name: cheapestMatchingRocket.name,
        price: cheapestMatchingRocket.price,
      }),
      expect.objectContaining({
        id: expensiveMatchingRocket.id,
        name: expensiveMatchingRocket.name,
        price: expensiveMatchingRocket.price,
      }),
    ])
  })
})
