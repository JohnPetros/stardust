import type { Broker, Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { GetChallengeCompletionAttemptsUseCase } from '@stardust/core/challenging/use-cases'
import {
  CalculateRewardForChallengeCompletionUseCase,
  CompleteSpaceUseCase,
  CompleteChallengeUseCase,
  RewardUserUseCase,
  CompleteStarUseCase,
} from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

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
    starId: string
    isAlreadyCompleted?: boolean
    isLastGalaxyStar?: boolean
    isFirstGalaxy?: boolean
    completedPlanetName?: string | null
  }
}

export class RewardUserForStarChallengeCompletionController
  implements Controller<Schema>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly challengesRepository: ChallengesRepository,
    private readonly executionsRepository: ChallengeCodeExecutionsRepository,
    private readonly broker: Broker = new InngestBroker(),
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const body = await http.getBody()
    const reward = await this.rewardCompletion(userId, body)
    return http.send(reward)
  }

  private async rewardCompletion(userId: string, body: Schema['body']) {
    const { challengeId } = body
    const counts = await this.getTrustedExecutionCounts(userId, challengeId)

    const reward = await this.calculateReward(userId, body, counts)

    await this.completeStar(userId, body)
    await this.completeSpace(userId, body)
    await this.completeChallenge(userId, challengeId)

    const user = await this.rewardUser(userId, reward.newCoins, reward.newXp)
    return {
      newCoins: reward.newCoins,
      newXp: reward.newXp,
      newLevel: user.newLevel,
      newStreak: user.newStreak,
      newWeekStatus: user.newWeekStatus,
      accuracyPercentage: reward.accuracyPercentage,
    }
  }

  private async completeStar(userId: string, body: Schema['body']) {
    const useCase = new CompleteStarUseCase(this.usersRepository, this.broker)
    await useCase.execute({
      userId,
      starId: body.starId,
      completedPlanetName: body.isAlreadyCompleted
        ? null
        : (body.completedPlanetName ?? null),
    })
  }

  private async getTrustedExecutionCounts(userId: string, challengeId: string) {
    const useCase = new GetChallengeCompletionAttemptsUseCase(
      this.challengesRepository,
      this.executionsRepository,
    )
    return await useCase.execute({ userId, challengeId })
  }

  private async calculateReward(
    userId: string,
    body: Schema['body'],
    counts: { maximumIncorrectAnswersCount: number; incorrectAnswersCount: number },
  ) {
    const useCase = new CalculateRewardForChallengeCompletionUseCase(this.usersRepository)
    return await useCase.execute({
      userId,
      challengeId: body.challengeId,
      challengeXp: body.challengeReward?.xp ?? 0,
      challengeCoins: body.challengeReward?.coins ?? 0,
      ...counts,
    })
  }

  private async completeChallenge(userId: string, challengeId: string) {
    const useCase = new CompleteChallengeUseCase(this.usersRepository, this.broker)
    await useCase.execute({ userId, challengeId })
  }

  private async rewardUser(userId: string, newCoins: number, newXp: number) {
    const useCase = new RewardUserUseCase(this.usersRepository, this.broker)
    return await useCase.execute({ userId, newCoins, newXp })
  }

  private async completeSpace(userId: string, body: Schema['body']) {
    const useCase = new CompleteSpaceUseCase(this.usersRepository, this.broker)
    await useCase.execute({
      userId,
      isLastGalaxyStar: body.isLastGalaxyStar ?? false,
      isFirstGalaxy: body.isFirstGalaxy ?? false,
    })
  }
}
