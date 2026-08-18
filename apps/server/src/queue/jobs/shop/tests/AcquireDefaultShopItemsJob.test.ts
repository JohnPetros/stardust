import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { AvatarsRepository, RocketsRepository } from '@stardust/core/shop/interfaces'
import { AcquireDefaultShopItemsUseCase } from '@stardust/core/shop/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { AcquireDefaultShopItemsJob } from '../AcquireDefaultShopItemsJob'

const payload = {
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  },
  firstUnlockedStarId: '22222222-2222-4222-8222-222222222222',
  firstReachedTierId: '33333333-3333-4333-8333-333333333333',
}

describe('AcquireDefaultShopItemsJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let rocketsRepository: Mock<RocketsRepository>
  let avatarsRepository: Mock<AvatarsRepository>
  let broker: Mock<Broker>
  let execute: jest.SpyInstance
  let job: AcquireDefaultShopItemsJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    rocketsRepository = mock<RocketsRepository>()
    avatarsRepository = mock<AvatarsRepository>()
    broker = mock<Broker>()
    job = new AcquireDefaultShopItemsJob(rocketsRepository, avatarsRepository, broker)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(AcquireDefaultShopItemsUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('passes the first-tier payload inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      AcquireDefaultShopItemsUseCase.name,
    )
    expect(execute).toHaveBeenCalledWith(payload)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Default shop item acquisition failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
