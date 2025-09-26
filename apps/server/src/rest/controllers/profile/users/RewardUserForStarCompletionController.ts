import type { Controller, EventBroker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CalculateRewardForStarCompletionUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    userId: string
  }
  body: {
    questionsCount: number
    incorrectAnswersCount: number
    nextStarId?: string
  }
}

export class RewardUserForStarCompletionController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const { nextStarId, questionsCount, incorrectAnswersCount } = await http.getBody()

    const { newCoins, newXp, accuracyPercentage } = await this.calculateReward(
      userId,
      nextStarId ?? null,
      questionsCount,
      incorrectAnswersCount,
    )

    if (nextStarId) {
      await this.unlockStar(userId, nextStarId)
    }

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
    nextStarId: string | null,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    const useCase = new CalculateRewardForStarCompletionUseCase(this.usersRepository)
    return await useCase.execute({
      userId,
      nextStarId,
      questionsCount,
      incorrectAnswersCount,
    })
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
