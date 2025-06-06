import type { UseCase } from '#global/interfaces/index'
import { Id, Percentage, type Logical } from '#global/domain/structures/index'
import { UserNotFoundError } from '../errors'
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

    console.log({
      challengeXp,
      challengeCoins,
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    })

    const accuracyPercentage = this.calculateAccuracyPercentage(
      maximumIncorrectAnswersCount,
      incorrectAnswersCount,
    )
    const newCoins = this.calculateCoins(
      challengeCoins,
      accuracyPercentage,
      isChallengeCompleted,
    )
    const newXp = this.calculateXp(challengeXp, accuracyPercentage, isChallengeCompleted)

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private calculateCoins(
    rewardCoins: number,
    accuracyPercentage: number,
    isChallengeCompleted: Logical,
  ) {
    return (
      Math.floor(rewardCoins * (accuracyPercentage / 100)) /
      (isChallengeCompleted.isTrue ? 2 : 1)
    )
  }

  private calculateXp(
    rewardXp: number,
    accuracyPercentage: number,
    isChallengeCompleted: Logical,
  ) {
    return (
      Math.floor(rewardXp * (accuracyPercentage / 100)) /
      (isChallengeCompleted.isTrue ? 2 : 1)
    )
  }

  private calculateAccuracyPercentage(
    maximumIncorrectAnswersCount: number,
    incorrectUserAnswersCount: number,
  ) {
    const percentage = Percentage.create(
      incorrectUserAnswersCount,
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
