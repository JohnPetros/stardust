import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { Integer } from '@stardust/core/global/structures'
import { NotAllowedError } from '@stardust/core/global/errors'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import {
  CalculateRewardForChallengeCompletionUseCase,
  CompleteChallengeUseCase,
  CompleteSpaceUseCase,
  RewardUserUseCase,
  CompleteStarUseCase,
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
      isAlreadyCompleted?: boolean
      isLastGalaxyStar?: boolean
      isFirstGalaxy?: boolean
      completedPlanetName?: string | null
      starId: string
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let challengesRepository: Mock<ChallengesRepository>
  let executionsRepository: Mock<ChallengeCodeExecutionsRepository>
  let controller: RewardUserForStarChallengeCompletionController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    challengesRepository = mock()
    executionsRepository = mock()
    http.send.mockImplementation()
    controller = new RewardUserForStarChallengeCompletionController(
      usersRepository,
      challengesRepository,
      executionsRepository,
    )
  })

  it('should complete the star and the challenge, never unlocking another star', async () => {
    const routeParams = { userId: IdFaker.fake().value }
    const body = {
      starId: IdFaker.fake().value,
      isAlreadyCompleted: false,
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
      completedPlanetName: 'Aurora',
      challengeId: IdFaker.fake().value,
      challengeReward: { xp: 20, coins: 5 },
    }
    const challenge = ChallengesFaker.fake({ id: body.challengeId })
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })
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
    challengesRepository.findById.mockResolvedValue(challenge)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(execution)
    executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
      Integer.create(2),
    )

    const calculateRewardSpy = jest
      .spyOn(CalculateRewardForChallengeCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(reward)
    const completeSpaceSpy = jest
      .spyOn(CompleteSpaceUseCase.prototype, 'execute')
      .mockResolvedValue()
    const completeStarSpy = jest
      .spyOn(CompleteStarUseCase.prototype, 'execute')
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
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount: 2,
    })
    expect(completeSpaceSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
    })
    expect(completeStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
      completedPlanetName: 'Aurora',
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

  it('should default the guard fields and not announce a planet completion', async () => {
    const routeParams = { userId: IdFaker.fake().value }
    const body = {
      starId: IdFaker.fake().value,
      challengeId: IdFaker.fake().value,
      challengeReward: { xp: 20, coins: 5 },
    }
    const challenge = ChallengesFaker.fake({ id: body.challengeId })
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })
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
    challengesRepository.findById.mockResolvedValue(challenge)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(execution)
    executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
      Integer.create(2),
    )

    const calculateRewardSpy = jest
      .spyOn(CalculateRewardForChallengeCompletionUseCase.prototype, 'execute')
      .mockResolvedValue(reward)
    const completeSpaceSpy = jest
      .spyOn(CompleteSpaceUseCase.prototype, 'execute')
      .mockResolvedValue()
    const completeStarSpy = jest
      .spyOn(CompleteStarUseCase.prototype, 'execute')
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
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount: 2,
    })
    expect(completeSpaceSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      isLastGalaxyStar: false,
      isFirstGalaxy: false,
    })
    expect(completeStarSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      starId: body.starId,
      completedPlanetName: null,
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

  it('should block reward when latest execution is not accepted', async () => {
    const routeParams = { userId: IdFaker.fake().value }
    const body = {
      starId: IdFaker.fake().value,
      challengeId: IdFaker.fake().value,
      challengeReward: { xp: 20, coins: 5 },
    }
    const challenge = ChallengesFaker.fake({ id: body.challengeId })
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("wrong")',
      status: 'wrong_answer',
      testResults: [],
      outputs: [],
      error: null,
    })

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    challengesRepository.findById.mockResolvedValue(challenge)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(execution)
    executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
      Integer.create(1),
    )
    const completeSpaceSpy = jest.spyOn(CompleteSpaceUseCase.prototype, 'execute')

    await expect(controller.handle(http)).rejects.toThrow(NotAllowedError)
    expect(completeSpaceSpy).not.toHaveBeenCalled()
  })

  describe('when the star or the challenge side effects behave differently', () => {
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

    function arrange(body: Schema['body'], routeParams: Schema['routeParams']) {
      const challenge = ChallengesFaker.fake({ id: body.challengeId })
      http.getRouteParams.mockReturnValue(routeParams)
      http.getBody.mockResolvedValue(body)
      challengesRepository.findById.mockResolvedValue(challenge)
      executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(
        ChallengeCodeExecution.create({
          code: 'escreva("ok")',
          status: 'accepted',
          testResults: [],
          outputs: [],
          error: null,
        }),
      )
      executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
        Integer.create(0),
      )
      jest
        .spyOn(CalculateRewardForChallengeCompletionUseCase.prototype, 'execute')
        .mockResolvedValue({ newCoins: 12, newXp: 30, accuracyPercentage: 100 })
      jest.spyOn(CompleteSpaceUseCase.prototype, 'execute').mockResolvedValue()
      jest
        .spyOn(CompleteChallengeUseCase.prototype, 'execute')
        .mockResolvedValue(UsersFaker.fakeDto({ id: routeParams.userId }))
      return {
        rewardUserSpy: jest
          .spyOn(RewardUserUseCase.prototype, 'execute')
          .mockResolvedValue(userProgress),
      }
    }

    it('should not announce a planet completion when the star was already completed', async () => {
      const routeParams = { userId: IdFaker.fake().value }
      const body = {
        starId: IdFaker.fake().value,
        challengeId: IdFaker.fake().value,
        challengeReward: { xp: 20, coins: 5 },
        isAlreadyCompleted: true,
        completedPlanetName: 'Aurora',
      }
      arrange(body, routeParams)
      const completeStarSpy = jest
        .spyOn(CompleteStarUseCase.prototype, 'execute')
        .mockResolvedValue()

      await controller.handle(http)

      expect(completeStarSpy).toHaveBeenCalledTimes(1)
      expect(completeStarSpy).toHaveBeenCalledWith({
        userId: routeParams.userId,
        starId: body.starId,
        completedPlanetName: null,
      })
      expect(http.send).toHaveBeenCalledTimes(1)
    })

    it('should not reward the user nor respond when the star cannot be completed', async () => {
      const routeParams = { userId: IdFaker.fake().value }
      const body = {
        starId: IdFaker.fake().value,
        challengeId: IdFaker.fake().value,
        challengeReward: { xp: 20, coins: 5 },
      }
      const { rewardUserSpy } = arrange(body, routeParams)
      jest
        .spyOn(CompleteStarUseCase.prototype, 'execute')
        .mockRejectedValue(new NotAllowedError('star locked'))

      await expect(controller.handle(http)).rejects.toThrow(NotAllowedError)

      expect(rewardUserSpy).not.toHaveBeenCalled()
      expect(CompleteChallengeUseCase.prototype.execute).not.toHaveBeenCalled()
      expect(http.send).not.toHaveBeenCalled()
    })
  })
})
