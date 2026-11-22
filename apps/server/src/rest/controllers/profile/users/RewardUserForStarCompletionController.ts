import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CalculateRewardForStarCompletionUseCase,
  RewardUserUseCase,
  CompleteStarUseCase,
  CompleteSpaceUseCase,
} from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

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

export class RewardUserForStarCompletionController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const body = await http.getBody()

    const { newCoins, newXp, accuracyPercentage } = await this.calculateReward(
      userId,
      body,
    )
    await this.completeStar(userId, body)

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

  private async calculateReward(userId: string, body: Schema['body']) {
    const useCase = new CalculateRewardForStarCompletionUseCase(this.usersRepository)
    return await useCase.execute({
      userId,
      isAlreadyCompleted: body.isAlreadyCompleted ?? false,
      questionsCount: body.questionsCount,
      incorrectAnswersCount: body.incorrectAnswersCount,
    })
  }

  private async completeStar(userId: string, body: Schema['body']) {
    const broker = new InngestBroker()
    const completeStar = new CompleteStarUseCase(this.usersRepository, broker)
    await completeStar.execute({
      userId,
      starId: body.starId,
      completedPlanetName: body.isAlreadyCompleted
        ? null
        : (body.completedPlanetName ?? null),
    })
    const completeSpace = new CompleteSpaceUseCase(this.usersRepository, broker)
    await completeSpace.execute({
      userId,
      isLastGalaxyStar: body.isLastGalaxyStar ?? false,
      isFirstGalaxy: body.isFirstGalaxy ?? false,
    })
  }

  private async rewardUser(userId: string, newCoins: number, newXp: number) {
    const useCase = new RewardUserUseCase(this.usersRepository, new InngestBroker())
    return await useCase.execute({ userId, newCoins, newXp })
  }
}
