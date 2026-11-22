import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { Percentage } from '#global/domain/structures/Percentage'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'

type Request = {
  userId: string
  isAlreadyCompleted: boolean
  questionsCount: number
  incorrectAnswersCount: number
}

type Response = Promise<{
  newCoins: number
  newXp: number
  accuracyPercentage: number
}>

export class CalculateRewardForStarCompletionUseCase
  implements UseCase<Request, Response>
{
  static readonly COINS_INCREASE_BASE = 4
  static readonly XP_INCREASE_BASE = 6

  constructor(private readonly repository: UsersRepository) {}

  async execute({
    userId,
    isAlreadyCompleted,
    incorrectAnswersCount,
    questionsCount,
  }: Request) {
    await this.findUser(Id.create(userId))

    if (questionsCount === 0) return { newCoins: 0, newXp: 0, accuracyPercentage: 100 }

    const newXp = this.calculateXp(
      isAlreadyCompleted,
      questionsCount,
      incorrectAnswersCount,
    )
    const newCoins = this.calculateCoins(
      isAlreadyCompleted,
      questionsCount,
      incorrectAnswersCount,
    )
    const accuracyPercentage = this.calculateAccuracyPercentage(
      questionsCount,
      incorrectAnswersCount,
    )

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private calculateAccuracyPercentage(
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    const percentage = Percentage.create(incorrectAnswersCount, questionsCount)
    return 100 - percentage.value
  }

  private calculateCoins(
    isAlreadyCompleted: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase =
      questionsCount * CalculateRewardForStarCompletionUseCase.COINS_INCREASE_BASE
    if (isAlreadyCompleted) increase /= 2

    const decrease = (increase / questionsCount) * incorrectAnswersCount

    const coins = increase - decrease
    return coins
  }

  private calculateXp(
    isAlreadyCompleted: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase =
      questionsCount * CalculateRewardForStarCompletionUseCase.XP_INCREASE_BASE
    if (isAlreadyCompleted) increase /= 2

    const decrease = (increase / questionsCount) * incorrectAnswersCount

    const xp = increase - decrease
    return xp
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
