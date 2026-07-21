import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { Integer } from '@stardust/core/global/structures'
import { NotAllowedError } from '@stardust/core/global/errors'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
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
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let challengesRepository: Mock<ChallengesRepository>
  let executionsRepository: Mock<ChallengeCodeExecutionsRepository>
  let controller: RewardUserForChallengeCompletionController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    challengesRepository = mock()
    executionsRepository = mock()
    http.send.mockImplementation()
    controller = new RewardUserForChallengeCompletionController(
      usersRepository,
      challengesRepository,
      executionsRepository,
    )
  })

  it('should orchestrate reward flow and send response payload', async () => {
    const routeParams = { userId: IdFaker.fake().value }
    const body = {
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
    challengesRepository.findById.mockResolvedValue(challenge)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(execution)
    executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
      Integer.create(2),
    )

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
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount: 2,
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

  it('should block reward when latest execution is not accepted', async () => {
    const routeParams = { userId: IdFaker.fake().value }
    const body = {
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

    await expect(controller.handle(http)).rejects.toThrow(NotAllowedError)
  })
})
