import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateRankingPositionsUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { UpdateRankingPositionsJob } from '../UpdateRankingPositionsJob'

const payload = { tierId: '11111111-1111-4111-8111-111111111111' }

describe('UpdateRankingPositionsJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: UpdateRankingPositionsJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    repository = mock<UsersRepository>()
    job = new UpdateRankingPositionsJob(repository)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    execute = jest
      .spyOn(UpdateRankingPositionsUseCase.prototype, 'execute')
      .mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('passes the ranking tier from the event payload inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.getPayload).toHaveBeenCalledTimes(1)
    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      UpdateRankingPositionsUseCase.name,
    )
    expect(execute).toHaveBeenCalledWith(payload.tierId)
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Ranking position update failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
