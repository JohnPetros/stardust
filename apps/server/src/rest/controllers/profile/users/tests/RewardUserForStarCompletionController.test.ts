import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import {
  CalculateRewardForStarCompletionUseCase,
  RemoveRecentlyUnlockedStarUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'

import { RewardUserForStarCompletionController } from '../RewardUserForStarCompletionController'

describe('Reward User For Star Completion Controller', () => {
  type Schema = {
    routeParams: {
      userId: string
    }
    body: {
      questionsCount: number
      incorrectAnswersCount: number
      starId: string
      nextStarId?: string
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: RewardUserForStarCompletionController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new RewardUserForStarCompletionController(usersRepository)
  })

  it('should orchestrate star completion reward flow when nextStarId is provided', async () => {
    const routeParams = { userId: 'user-1' }
    const body = {
      starId: 'star-1',
      nextStarId: 'star-2',
      questionsCount: 5,
      incorrectAnswersCount: 1,
    }
    const reward = { newCoins: 8, newXp: 24, accuracyPercentage: 80 }
    const userProgress = {
      newLevel: 2,
      newStreak: 4,
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
      .spyOn(CalculateRewardForStarCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(reward)
    const unlockStarSpy = jest
      .spyOn(UnlockStarUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
    const removeRecentlyUnlockedStarSpy = jest
      .spyOn(RemoveRecentlyUnlockedStarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)
    const rewardUserSpy = jest
      .spyOn(RewardUserUseCase.prototype, 'execute')
      .mockResolvedValue(userProgress)

    await controller.handle(http)

    expect(calculateRewardSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
      nextStarId: body.nextStarId,
      questionsCount: body.questionsCount,
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
      questionsCount: 5,
      incorrectAnswersCount: 1,
    }
    const reward = { newCoins: 8, newXp: 24, accuracyPercentage: 80 }
    const userProgress = {
      newLevel: 2,
      newStreak: 4,
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
      .spyOn(CalculateRewardForStarCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(reward)
    const unlockStarSpy = jest
      .spyOn(UnlockStarUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
    const removeRecentlyUnlockedStarSpy = jest
      .spyOn(RemoveRecentlyUnlockedStarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)
    const rewardUserSpy = jest
      .spyOn(RewardUserUseCase.prototype, 'execute')
      .mockResolvedValue(userProgress)

    await controller.handle(http)

    expect(calculateRewardSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
      nextStarId: null,
      questionsCount: body.questionsCount,
      incorrectAnswersCount: body.incorrectAnswersCount,
    })
    expect(unlockStarSpy).not.toHaveBeenCalled()
    expect(removeRecentlyUnlockedStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
    })
    expect(rewardUserSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      newCoins: reward.newCoins,
      newXp: reward.newXp,
    })
  })
})
