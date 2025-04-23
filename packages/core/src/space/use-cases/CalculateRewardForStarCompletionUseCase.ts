import { User } from '../../global/domain/entities'
import type { UserDto } from '../../global/dtos'
import { Planet, Star } from '../domain/entities'
import type { ISpaceService, UseCase } from '../../global/interfaces'
import { Percentage } from '../../global/domain/structures'

type Request = {
  userDto: UserDto
  starId: string
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

  constructor(private readonly spaceService: ISpaceService) {}

  async do({ userDto, incorrectAnswersCount, questionsCount, starId }: Request) {
    const user = User.create(userDto)

    const { isNextStarUnlocked } = await this.fetchNextStar(starId, user)

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

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private async fetchNextStar(currentStarId: string, user: User) {
    const planet = await this.fetchPlanet(currentStarId)
    let nextStar = planet.getNextStar(currentStarId)
    let isLastStar = false

    if (!nextStar) {
      const response = await this.spaceService.fetchNextStarFromNextPlanet(planet)
      if (response.isSuccess) {
        nextStar = Star.create(response.body)
      }
      if (response.isFailure) {
        isLastStar = true
      }
    }

    let isNextStarUnlocked = false

    if (isLastStar) {
      isNextStarUnlocked = user.hasCompletedSpace.isFalse
    } else if (nextStar) {
      isNextStarUnlocked = user.hasUnlockedStar(nextStar.id).isTrue
    }

    return {
      nextStar,
      isNextStarUnlocked,
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

  private async fetchPlanet(starId: string) {
    const response = await this.spaceService.fetchPlanetByStar(starId)
    if (response.isFailure) response.throwError()

    return Planet.create(response.body)
  }
}
