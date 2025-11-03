import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { User } from '../domain/entities'
import { Id } from '#global/domain/structures/Id'
import { Percentage } from '#global/domain/structures/Percentage'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'

type Request = {
  userId: string
  starId: string
  nextStarId: string | null
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
    starId,
    nextStarId,
    incorrectAnswersCount,
    questionsCount,
  }: Request) {
    const user = await this.findUser(Id.create(userId))
    const isNextStarUnlocked = this.checkNextStarIsUnlocked(
      user,
      Id.create(starId),
      nextStarId ? Id.create(nextStarId) : null,
    )

    const newXp = this.calculateXp(
      isNextStarUnlocked.isTrue,
      questionsCount,
      incorrectAnswersCount,
    )
    const newCoins = this.calculateCoins(
      isNextStarUnlocked.isTrue,
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

  private checkNextStarIsUnlocked(user: User, starId: Id, nextStarId: Id | null) {
    const isLastSpaceStar = nextStarId === null
    if (isLastSpaceStar) return user.hasCompletedSpace
    return user.hasUnlockedStar(nextStarId).and(user.hasRecentlyUnlockedStar(starId))
  }

  private calculateAccuracyPercentage(
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    const percentage = Percentage.create(incorrectAnswersCount, questionsCount)
    return 100 - percentage.value
  }

  private calculateCoins(
    isNextStarUnlocked: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase =
      questionsCount * CalculateRewardForStarCompletionUseCase.COINS_INCREASE_BASE
    if (isNextStarUnlocked) increase /= 2

    const decrease = (increase / questionsCount) * incorrectAnswersCount

    const coins = increase - decrease
    return coins
  }

  private calculateXp(
    isNextStarUnlocked: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase =
      questionsCount * CalculateRewardForStarCompletionUseCase.XP_INCREASE_BASE
    if (isNextStarUnlocked) increase /= 2

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
