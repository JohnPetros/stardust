import { HonoApp } from '@/app/hono/HonoApp'
import { AcquireDefaultShopItemsJob } from '@/queue/jobs/shop'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'

import { InngestFixture } from '../fixtures/InngestFixture'

const mockJobHandle = jest.fn().mockResolvedValue(undefined)

jest.mock('@/queue/jobs/shop', () => ({
  AcquireDefaultShopItemsJob: jest.fn().mockImplementation(() => ({
    handle: mockJobHandle,
  })),
}))

describe('ShopFunctions with Inngest', () => {
  let inngest: InngestFixture

  beforeAll(async () => {
    const app = new HonoApp()
    app.registerMiddlewares()
    app.registerInngestRoute()
    app.setUpErrorHandler()

    inngest = new InngestFixture()
    await inngest.setup(app.hono)
  })

  afterAll(async () => {
    await inngest.teardown()
  })

  beforeEach(() => {
    mockJobHandle.mockClear()
    jest.mocked(AcquireDefaultShopItemsJob).mockClear()
  })

  it('executes the default shop items job when Inngest receives a first-tier event', async () => {
    const eventId = 'shop-functions-integration-event'
    const response = await inngest.send({
      id: eventId,
      name: FirstTierReachedEvent._NAME,
      data: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Ada Lovelace',
          email: 'ada@example.com',
        },
        firstUnlockedStarId: '22222222-2222-4222-8222-222222222222',
        firstReachedTierId: '33333333-3333-4333-8333-333333333333',
        firstTierId: '44444444-4444-4444-8444-444444444444',
      },
    })

    expect(response.ids).toHaveLength(1)

    await waitFor(() => mockJobHandle.mock.calls.length === 1)

    expect(AcquireDefaultShopItemsJob).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
    expect(mockJobHandle).toHaveBeenCalledWith(expect.anything())
  })
})

async function waitFor(condition: () => boolean) {
  const deadline = Date.now() + 15000

  while (Date.now() < deadline) {
    if (condition()) return
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error('Timed out waiting for Inngest function execution')
}
