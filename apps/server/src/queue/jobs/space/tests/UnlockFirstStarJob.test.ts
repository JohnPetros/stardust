import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { UnlockFirstStarUseCase } from '@stardust/core/space/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { UnlockFirstStarJob } from '../UnlockFirstStarJob'

const payload = {
  accountId: '11111111-1111-4111-8111-111111111111',
  accountName: 'Ada Lovelace',
  accountEmail: 'ada@example.com',
}

describe('UnlockFirstStarJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let repository: Mock<PlanetsRepository>
  let broker: Mock<Broker>
  let execute: jest.SpyInstance
  let job: UnlockFirstStarJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    repository = mock<PlanetsRepository>()
    broker = mock<Broker>()
    job = new UnlockFirstStarJob(repository, broker)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest.spyOn(UnlockFirstStarUseCase.prototype, 'execute').mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('maps account fields to the first-star use case inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      UnlockFirstStarUseCase.name,
    )
    expect(execute).toHaveBeenCalledWith({
      userId: payload.accountId,
      userName: payload.accountName,
      userEmail: payload.accountEmail,
    })
  })

  it('propagates use case failures', async () => {
    const failure = new Error('First star unlock failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
