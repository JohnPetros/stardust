import type { Amqp } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ExpireNewChallengesUseCase } from '@stardust/core/challenging/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { ExpireNewChallengesJob } from '../ExpireNewChallengesJob'

describe('ExpireNewChallengesJob', () => {
  let amqp: Mock<Amqp>
  let repository: Mock<ChallengesRepository>
  let execute: jest.SpyInstance
  let job: ExpireNewChallengesJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    repository = mock<ChallengesRepository>()
    job = new ExpireNewChallengesJob(repository)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(ExpireNewChallengesUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('executes the expiration use case inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(expect.any(Function), 'Expire New Challenges')
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Expiration failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
