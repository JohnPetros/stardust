import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { CalculateRewardForChallengeCompletionUseCase } from '@stardust/core/profile/use-cases'
import { CompleteChallengeUseCase } from '@stardust/core/profile/use-cases'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { RewardUserForChallengeCompletionController } from '../RewardUserForChallengeCompletionController'

describe('Reward User For Challenge Completion Controller', () => {
  type Schema = {
    routeParams: {
      userId: string
    }
    body: {
      challengeId: string
      challengeReward?: {
        xp: number
        coins: number
      }
      maximumIncorrectAnswersCount: number
      incorrectAnswersCount: number
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: RewardUserForChallengeCompletionController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new RewardUserForChallengeCompletionController(usersRepository)
  })

  it('should orchestrate reward flow and send response payload', async () => {
    const routeParams = { userId: 'user-1' }
    const body = {
      challengeId: 'challenge-1',
      challengeReward: { xp: 20, coins: 5 },
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 2,
    }
    const reward = { newCoins: 10, newXp: 40, accuracyPercentage: 80 }
    const userProgress = {
      newLevel: 3,
      newStreak: 7,
      newWeekStatus: [
        'todo',
        'done',
        'todo',
        'todo',
        'todo',
        'todo',
        'todo',
      ] as WeekStatusValue,
    }

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)

    const calculateRewardSpy = jest
      .spyOn(CalculateRewardForChallengeCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(reward)
    const completeChallengeSpy = jest
      .spyOn(CompleteChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
    const rewardUserSpy = jest
      .spyOn(RewardUserUseCase.prototype, 'execute')
      .mockResolvedValue(userProgress)

    await controller.handle(http)

    expect(calculateRewardSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      challengeId: body.challengeId,
      challengeXp: body.challengeReward.xp,
      challengeCoins: body.challengeReward.coins,
      maximumIncorrectAnswersCount: body.maximumIncorrectAnswersCount,
      incorrectAnswersCount: body.incorrectAnswersCount,
    })
    expect(completeChallengeSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      challengeId: body.challengeId,
    })
    expect(rewardUserSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      newCoins: reward.newCoins,
      newXp: reward.newXp,
    })
    expect(http.send).toHaveBeenCalledWith({
      newCoins: reward.newCoins,
      newXp: reward.newXp,
      newLevel: userProgress.newLevel,
      newStreak: userProgress.newStreak,
      newWeekStatus: userProgress.newWeekStatus,
      accuracyPercentage: reward.accuracyPercentage,
    })
  })
})
