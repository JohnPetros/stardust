import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { ResetWeekStatusForAllUsersUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { ResetWeekStatusForAllUsersJob } from '../ResetWeekStatusForAllUsersJob'

describe('ResetWeekStatusForAllUsersJob', () => {
  let amqp: Mock<Amqp>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: ResetWeekStatusForAllUsersJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    repository = mock<UsersRepository>()
    job = new ResetWeekStatusForAllUsersJob(repository)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(ResetWeekStatusForAllUsersUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('executes the week status reset inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      ResetWeekStatusForAllUsersUseCase.name,
    )
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Week status reset failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
