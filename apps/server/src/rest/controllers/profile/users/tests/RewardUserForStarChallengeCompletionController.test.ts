import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import {
  CalculateRewardForChallengeCompletionUseCase,
  CompleteChallengeUseCase,
  RemoveRecentlyUnlockedStarUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'

import { RewardUserForStarChallengeCompletionController } from '../RewardUserForStarChallengeCompletionController'

describe('Reward User For Star Challenge Completion Controller', () => {
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
      nextStarId?: string
      starId: string
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: RewardUserForStarChallengeCompletionController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new RewardUserForStarChallengeCompletionController(usersRepository)
  })

  it('should orchestrate star challenge reward flow when nextStarId is provided', async () => {
    const routeParams = { userId: 'user-1' }
    const body = {
      starId: 'star-1',
      nextStarId: 'star-2',
      challengeId: 'challenge-1',
      challengeReward: { xp: 20, coins: 5 },
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 2,
    }
    const reward = { newCoins: 12, newXp: 30, accuracyPercentage: 80 }
    const userProgress = {
      newLevel: 3,
      newStreak: 5,
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
    const unlockStarSpy = jest
      .spyOn(UnlockStarUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
    const removeRecentlyUnlockedStarSpy = jest
      .spyOn(RemoveRecentlyUnlockedStarUseCase.prototype, 'execute')
      .mockResolvedValue()
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
    expect(unlockStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.nextStarId,
    })
    expect(removeRecentlyUnlockedStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
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

  it('should not unlock a star when nextStarId is not provided', async () => {
    const routeParams = { userId: 'user-1' }
    const body = {
      starId: 'star-1',
      challengeId: 'challenge-1',
      challengeReward: { xp: 20, coins: 5 },
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 2,
    }
    const reward = { newCoins: 12, newXp: 30, accuracyPercentage: 80 }
    const userProgress = {
      newLevel: 3,
      newStreak: 5,
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
    const unlockStarSpy = jest
      .spyOn(UnlockStarUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
    const removeRecentlyUnlockedStarSpy = jest
      .spyOn(RemoveRecentlyUnlockedStarUseCase.prototype, 'execute')
      .mockResolvedValue()
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
    expect(unlockStarSpy).not.toHaveBeenCalled()
    expect(removeRecentlyUnlockedStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
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
  })
})
