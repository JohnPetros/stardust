import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateTierUseCase } from '@stardust/core/profile/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { UpdateTierForRankingWinnersJob } from '../UpdateTierForRankingWinnersJob'

const payload = {
  tierId: '11111111-1111-4111-8111-111111111111',
  winnersIds: ['22222222-2222-4222-8222-222222222222'],
}

describe('UpdateTierForRankingWinnersJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let repository: Mock<UsersRepository>
  let execute: jest.SpyInstance
  let job: UpdateTierForRankingWinnersJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    repository = mock<UsersRepository>()
    job = new UpdateTierForRankingWinnersJob(repository)
    amqp.getPayload.mockReturnValue(payload)
    execute = jest.spyOn(UpdateTierUseCase.prototype, 'execute').mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('updates winners in the tier selected by the event', async () => {
    await job.handle(amqp)

    expect(execute).toHaveBeenCalledWith({
      tierId: payload.tierId,
      usersIds: payload.winnersIds,
    })
  })

  it('propagates use case failures', async () => {
    const failure = new Error('Winner tier update failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
