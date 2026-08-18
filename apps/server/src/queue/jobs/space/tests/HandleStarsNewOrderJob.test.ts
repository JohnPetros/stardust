import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { HandleStarsNewOrderUseCase } from '@stardust/core/space/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { HandleStarsNewOrderJob } from '../HandleStarsNewOrderJob'

describe('HandleStarsNewOrderJob', () => {
  let amqp: Mock<Amqp>
  let repository: Mock<PlanetsRepository>
  let broker: Mock<Broker>
  let execute: jest.SpyInstance
  let job: HandleStarsNewOrderJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    repository = mock<PlanetsRepository>()
    broker = mock<Broker>()
    job = new HandleStarsNewOrderJob(repository, broker)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(HandleStarsNewOrderUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('executes the star order handler inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      HandleStarsNewOrderUseCase.name,
    )
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Star order update failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
