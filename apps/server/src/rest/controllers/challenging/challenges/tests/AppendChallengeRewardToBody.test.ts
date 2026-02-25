import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeRewardUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { AppendChallengeRewardToBodyController } from '../AppendChallengeRewardToBody'

describe('Append Challenge Reward To Body Controller', () => {
  let http: Mock<Http<{ body: { challengeId: string } }>>
  let repository: Mock<ChallengesRepository>
  let controller: AppendChallengeRewardToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendChallengeRewardToBodyController(repository)
  })

  it('should append challenge reward to request body and pass to next controller', async () => {
    const challengeId = IdFaker.fake().value
    const reward = { xp: 40, coins: 20 }

    http.getBody.mockResolvedValue({ challengeId })
    const executeSpy = jest
      .spyOn(GetChallengeRewardUseCase.prototype, 'execute')
      .mockResolvedValue(reward)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ challengeId })
    expect(http.extendBody).toHaveBeenCalledWith({
      challengeReward: reward,
    })
    expect(http.pass).toHaveBeenCalled()
  })
})
