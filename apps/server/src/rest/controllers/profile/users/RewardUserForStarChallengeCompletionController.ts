import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CalculateRewardForChallengeCompletionUseCase,
  CompleteChallengeUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'

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
  }
}

export class RewardUserForStarChallengeCompletionController
  implements Controller<Schema>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const {
      nextStarId,
      challengeId,
      challengeReward,
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    } = await http.getBody()

    const { newCoins, newXp, accuracyPercentage } = await this.calculateReward(
      userId,
      challengeId,
      challengeReward?.xp ?? 0,
      challengeReward?.coins ?? 0,
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    )

    if (nextStarId) {
      await this.unlockStar(userId, nextStarId)
    }

    await this.completeChallenge(userId, challengeId)

    const { newLevel, newStreak, newWeekStatus } = await this.rewardUser(
      userId,
      newCoins,
      newXp,
    )

    return http.send({
      newCoins,
      newXp,
      newLevel,
      newStreak,
      newWeekStatus,
      accuracyPercentage,
    })
  }

  private async calculateReward(
    userId: string,
    challengeId: string,
    challengeXp: number,
    challengeCoins: number,
    maximumIncorrectAnswersCount: number,
    incorrectAnswersCount: number,
  ) {
    const useCase = new CalculateRewardForChallengeCompletionUseCase(this.usersRepository)
    return await useCase.execute({
      userId,
      challengeId,
      challengeXp,
      challengeCoins,
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    })
  }

  private async completeChallenge(userId: string, challengeId: string) {
    const useCase = new CompleteChallengeUseCase(this.usersRepository)
    await useCase.execute({ userId, challengeId })
  }

  private async unlockStar(userId: string, starId: string) {
    const useCase = new UnlockStarUseCase(this.usersRepository)
    await useCase.execute({ userId, starId })
  }

  private async rewardUser(userId: string, newCoins: number, newXp: number) {
    const useCase = new RewardUserUseCase(this.usersRepository)
    return await useCase.execute({ userId, newCoins, newXp })
  }
}
