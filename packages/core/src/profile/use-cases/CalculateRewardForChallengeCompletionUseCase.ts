import type { UseCase } from '#global/interfaces/index'
import { Id, Percentage, type Logical } from '#global/domain/structures/index'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId: string
  challengeId: string
  challengeXp: number
  challengeCoins: number
  maximumIncorrectAnswersCount: number
  incorrectAnswersCount: number
}

type Response = Promise<{
  newCoins: number
  newXp: number
  accuracyPercentage: number
}>

export class CalculateRewardForChallengeCompletionUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: UsersRepository) {}

  async execute({
    userId,
    challengeId,
    challengeXp,
    challengeCoins,
    maximumIncorrectAnswersCount,
    incorrectAnswersCount,
  }: Request) {
    const user = await this.findUser(Id.create(userId))
    const isChallengeCompleted = user.hasCompletedChallenge(Id.create(challengeId))
    const accuracyPercentage = this.calculateAccuracyPercentage(
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    )
    const rewardMultiplier = this.calculateRewardMultiplier(
      accuracyPercentage,
      isChallengeCompleted,
    )
    const newCoins = this.calculateReward(challengeCoins, rewardMultiplier)
    const newXp = this.calculateReward(challengeXp, rewardMultiplier)

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private calculateReward(baseReward: number, rewardMultiplier: number) {
    return Math.max(0, Math.floor(baseReward * rewardMultiplier))
  }

  private calculateRewardMultiplier(
    accuracyPercentage: number,
    isChallengeCompleted: Logical,
  ) {
    const completionMultiplier = isChallengeCompleted.isTrue ? 0.5 : 1
    return (accuracyPercentage / 100) * completionMultiplier
  }

  private calculateAccuracyPercentage(
    maximumIncorrectAnswersCount: number,
    incorrectUserAnswersCount: number,
  ) {
    const boundedIncorrectAnswersCount = Math.min(
      Math.max(incorrectUserAnswersCount, 0),
      maximumIncorrectAnswersCount,
    )
    const percentage = Percentage.create(
      boundedIncorrectAnswersCount,
      maximumIncorrectAnswersCount,
    )
    return 100 - percentage.value
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
