import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import {
  CalculateRewardForStarCompletionUseCase,
  CompleteSpaceUseCase,
  CompleteStarUseCase,
  RewardUserUseCase,
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
      isAlreadyCompleted?: boolean
      isLastGalaxyStar?: boolean
      isFirstGalaxy?: boolean
      completedPlanetName?: string | null
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: RewardUserForStarCompletionController

  const routeParams = { userId: 'user-1' }
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

  function spyOnUseCases() {
    return {
      calculateReward: jest
        .spyOn(CalculateRewardForStarCompletionUseCase.prototype, 'execute')
        .mockResolvedValue(reward),
      completeStar: jest
        .spyOn(CompleteStarUseCase.prototype, 'execute')
        .mockResolvedValue(undefined),
      completeSpace: jest
        .spyOn(CompleteSpaceUseCase.prototype, 'execute')
        .mockResolvedValue(undefined),
      rewardUser: jest
        .spyOn(RewardUserUseCase.prototype, 'execute')
        .mockResolvedValue(userProgress),
    }
  }

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    http.getRouteParams.mockReturnValue(routeParams)
    controller = new RewardUserForStarCompletionController(usersRepository)
  })

  it('should complete the star, never unlock another one, and reward the user', async () => {
    const body = {
      starId: 'star-1',
      questionsCount: 5,
      incorrectAnswersCount: 1,
      isAlreadyCompleted: false,
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
      completedPlanetName: 'Aurora',
    }
    http.getBody.mockResolvedValue(body)
    const spies = spyOnUseCases()

    await controller.handle(http)

    expect(spies.calculateReward).toHaveBeenCalledWith({
      userId: routeParams.userId,
      isAlreadyCompleted: false,
      questionsCount: body.questionsCount,
      incorrectAnswersCount: body.incorrectAnswersCount,
    })
    expect(spies.completeStar).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
      completedPlanetName: 'Aurora',
    })
    expect(spies.completeSpace).toHaveBeenCalledWith({
      userId: routeParams.userId,
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
    })
    expect(spies.rewardUser).toHaveBeenCalledWith({
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

  it('should not announce the planet completion when the star was already completed', async () => {
    http.getBody.mockResolvedValue({
      starId: 'star-1',
      questionsCount: 5,
      incorrectAnswersCount: 0,
      isAlreadyCompleted: true,
      isLastGalaxyStar: true,
      isFirstGalaxy: true,
      completedPlanetName: 'Aurora',
    })
    const spies = spyOnUseCases()

    await controller.handle(http)

    expect(spies.calculateReward).toHaveBeenCalledWith(
      expect.objectContaining({ isAlreadyCompleted: true }),
    )
    expect(spies.completeStar).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: 'star-1',
      completedPlanetName: null,
    })
  })

  it('should default the guard fields when the body has none', async () => {
    http.getBody.mockResolvedValue({
      starId: 'star-1',
      questionsCount: 5,
      incorrectAnswersCount: 1,
    })
    const spies = spyOnUseCases()

    await controller.handle(http)

    expect(spies.calculateReward).toHaveBeenCalledWith(
      expect.objectContaining({ isAlreadyCompleted: false }),
    )
    expect(spies.completeSpace).toHaveBeenCalledWith({
      userId: routeParams.userId,
      isLastGalaxyStar: false,
      isFirstGalaxy: false,
    })
  })

  it('should not reward the user when completing the star fails', async () => {
    http.getBody.mockResolvedValue({
      starId: 'star-1',
      questionsCount: 5,
      incorrectAnswersCount: 1,
    })
    const spies = spyOnUseCases()
    spies.completeStar.mockRejectedValue(new Error('boom'))

    await expect(controller.handle(http)).rejects.toThrow('boom')

    expect(spies.rewardUser).not.toHaveBeenCalled()
    expect(http.send).not.toHaveBeenCalled()
  })
})
