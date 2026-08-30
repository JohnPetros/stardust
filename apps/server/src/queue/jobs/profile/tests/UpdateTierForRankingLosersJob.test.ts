import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateTierUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { UpdateTierForRankingLosersJob } from '../UpdateTierForRankingLosersJob'

const payload = {
  tierId: '11111111-1111-4111-8111-111111111111',
  losersIds: ['22222222-2222-4222-8222-222222222222'],
}

describe('UpdateTierForRankingLosersJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: UpdateTierForRankingLosersJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    repository = mock<UsersRepository>()
    job = new UpdateTierForRankingLosersJob(repository)
    amqp.getPayload.mockReturnValue(payload)
    execute = jest.spyOn(UpdateTierUseCase.prototype, 'execute').mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('updates losers in the tier selected by the event', async () => {
    await job.handle(amqp)

    expect(execute).toHaveBeenCalledWith({
      tierId: payload.tierId,
      usersIds: payload.losersIds,
    })
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Loser tier update failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
