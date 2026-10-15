import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CalculateRewardForStarCompletionUseCase,
  RewardUserUseCase,
  UnlockStarUseCase,
  RemoveRecentlyUnlockedStarUseCase,
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
    nextStarId?: string
  }
}

export class RewardUserForStarCompletionController implements Controller<Schema> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const body = await http.getBody()
    return this.database.run(async () => http.send(await this.complete(userId, body)))
  }

  private async complete(userId: string, body: Schema['body']) {
    const reward = await this.calculateReward(userId, body)
    await this.unlockNextStar(userId, body.nextStarId)
    await this.removeRecentlyUnlockedStar(userId, body.starId)
    const progress = await this.rewardUser(userId, reward.newCoins, reward.newXp)
    return { ...reward, ...progress }
  }

  private calculateReward(userId: string, body: Schema['body']) {
    const useCase = new CalculateRewardForStarCompletionUseCase(this.usersRepository)
    return useCase.execute(this.rewardInput(userId, body))
  }

  private rewardInput(userId: string, body: Schema['body']) {
    return {
      userId,
      ...this.answerInput(body),
      nextStarId: body.nextStarId ?? null,
    }
  }

  private answerInput(body: Schema['body']) {
    const { starId, questionsCount, incorrectAnswersCount } = body
    return { starId, questionsCount, incorrectAnswersCount }
  }

  private async unlockNextStar(userId: string, starId?: string) {
    if (starId) await this.unlockStar(userId, starId)
  }

  private async unlockStar(userId: string, starId: string) {
    const useCase = this.createUnlockStarUseCase()
    await useCase.execute({ userId, starId })
  }

  private async removeRecentlyUnlockedStar(userId: string, starId: string) {
    const useCase = new RemoveRecentlyUnlockedStarUseCase(this.usersRepository)
    return await useCase.execute({ userId, starId })
  }

  private async rewardUser(userId: string, newCoins: number, newXp: number) {
    const useCase = this.createRewardUserUseCase()
    return await useCase.execute({ userId, newCoins, newXp })
  }

  private createUnlockStarUseCase() {
    return new UnlockStarUseCase(this.database, this.usersRepository, new InngestBroker())
  }

  private createRewardUserUseCase() {
    return new RewardUserUseCase(this.database, this.usersRepository, new InngestBroker())
  }
}
