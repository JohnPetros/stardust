import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { ObserveStreakBreakJob } from '../ObserveStreakBreakJob'

describe('ObserveStreakBreakJob', () => {
  let amqp: Mock<Amqp>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: ObserveStreakBreakJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    repository = mock<UsersRepository>()
    job = new ObserveStreakBreakJob(repository)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(ObserveStreakBreakUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('executes the streak observation inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      ObserveStreakBreakUseCase.name,
    )
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Streak observation failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
