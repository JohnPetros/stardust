import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateSpaceForAllUsersUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { UpdateSpaceForAllUsersJob } from '../UpdateSpaceForAllUsersJob'

const payload = {
  reorderedStarIds: [
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
  ],
}

describe('UpdateSpaceForAllUsersJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: UpdateSpaceForAllUsersJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    repository = mock<UsersRepository>()
    job = new UpdateSpaceForAllUsersJob(repository)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(UpdateSpaceForAllUsersUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('passes reordered star ids to the use case inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      UpdateSpaceForAllUsersUseCase.name,
    )
    expect(execute).toHaveBeenCalledWith(payload)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Space update failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
