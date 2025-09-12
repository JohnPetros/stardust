import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Percentage } from '#global/domain/structures/Percentage'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { EventBroker } from '#global/interfaces/EventBroker'
import { SpaceCompletedEvent } from '#space/domain/events/SpaceCompletedEvent'

type Request = {
  userId: string
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

  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: EventBroker,
  ) {}

  async execute({ userId, nextStarId, incorrectAnswersCount, questionsCount }: Request) {
    const user = await this.findUser(Id.create(userId))
    const isLastSpaceStar = nextStarId === null
    const isNextStarUnlocked = isLastSpaceStar
      ? user.hasCompletedSpace.isTrue
      : user.hasUnlockedStar(Id.create(nextStarId)).isTrue

    const newXp = this.calculateXp(
      isNextStarUnlocked,
      questionsCount,
      incorrectAnswersCount,
    )
    const newCoins = this.calculateCoins(
      isNextStarUnlocked,
      questionsCount,
      incorrectAnswersCount,
    )
    const accuracyPercentage = this.calculateAccuracyPercentage(
      questionsCount,
      incorrectAnswersCount,
    )

    if (isLastSpaceStar && user.hasCompletedSpace.isFalse) {
      user.completeSpace()
      await this.repository.replace(user)

      const event = new SpaceCompletedEvent({
        userSlug: user.slug.value,
        userName: user.name.value,
      })
      await this.broker.publish(event)
    }

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
