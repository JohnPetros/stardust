import { Planet, Star, User } from '@/@core/domain/entities'
import { StarRewardingPayload } from '@/@core/domain/structs/StarRewardingPayload'
import { InvalidRewardingPayloadError } from '@/@core/errors/validation'
import type { RewardingPayloadOrigin } from '@/@core/domain/types'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { RewardingPayloadDto, UserDto } from '#dtos'
import type { ISpaceService, IUsersService } from '@/@core/interfaces/services'

type Request = {
  userDto: UserDto
  rewardingPayloadDto: RewardingPayloadDto
}

type Response = Promise<{
  origin: RewardingPayloadOrigin
  newLevel: number | null
  newCoins: number
  newXp: number
  accuracyPercentage: number
  time: string
}>

export class RewardUserUseCase implements IUseCase<Request, Response> {
  static readonly COINS_INCREASE_BASE = 2
  static readonly XP_INCREASE_BASE = 4

  constructor(
    private readonly usersService: IUsersService,
    private readonly spaceService: ISpaceService,
  ) {}

  async do({ userDto, rewardingPayloadDto }: Request): Response {
    const user = User.create(userDto)

    if (StarRewardingPayload.canBeCreatedBy(rewardingPayloadDto)) {
      const starRewardingPayload = StarRewardingPayload.create(rewardingPayloadDto)
      const rewardForStarCompletition = await this.getRewardForStarCompletition(
        user,
        starRewardingPayload,
      )

      return {
        origin: starRewardingPayload.origin,
        newLevel: user.level.didUp.isTrue ? user.level.value : null,
        newCoins: rewardForStarCompletition.newCoins,
        newXp: rewardForStarCompletition.newXp,
        accuracyPercentage: rewardForStarCompletition.accuracyPercentage,
        time: starRewardingPayload.time,
      }
    }

    throw new InvalidRewardingPayloadError()
  }

  private async getRewardForStarCompletition(
    user: User,
    starRewardingPayload: StarRewardingPayload,
  ) {
    const currentStarId = starRewardingPayload.starId.value
    const { nextStar, isNextStarUnlocked } = await this.fetchNextStar(currentStarId, user)

    const incorrectAnswersCount = starRewardingPayload.incorrectAnswersCount.value
    const questionsCount = starRewardingPayload.questionsCount.value

    const newXp = this.getXp(isNextStarUnlocked, questionsCount, incorrectAnswersCount)
    const newCoins = this.getCoins(
      isNextStarUnlocked,
      questionsCount,
      incorrectAnswersCount,
    )
    const accuracyPercentage = this.getAccuracyPercentage(
      questionsCount,
      incorrectAnswersCount,
    )

    await this.saveStarReward(user, newCoins, newXp, nextStar)

    return {
      user,
      newCoins,
      newXp,
      accuracyPercentage,
      secondsCount: starRewardingPayload.secondsCount.value,
    }
  }

  private async fetchNextStar(currentStarId: string, user: User) {
    const planet = await this.fetchPlanet(currentStarId)
    let nextStar = planet.getNextStar(currentStarId)
    let isLastStar = false

    if (!nextStar) {
      const response = await this.spaceService.fetchNextStarFromNextPlanet(planet)
      if (response.isSuccess) {
        nextStar = Star.create(response.data)
        console.log(nextStar)
      }
      if (response.isFailure) {
        isLastStar = true
      }
    }

    let isNextStarUnlocked = false

    if (isLastStar) {
      isNextStarUnlocked = true
    } else if (nextStar) {
      isNextStarUnlocked = user.hasUnlockedStar(nextStar.id).isTrue
    }

    return {
      nextStar,
      isNextStarUnlocked,
    }
  }

  private getAccuracyPercentage(questionsCount: number, incorrectAnswersCount: number) {
    const percentage = ((questionsCount - incorrectAnswersCount) / questionsCount) * 100
    return percentage === 0 ? 100 : percentage
  }

  private getCoins(
    isNextStarUnlocked: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase = questionsCount * RewardUserUseCase.COINS_INCREASE_BASE
    if (isNextStarUnlocked) increase /= 2

    const decrease = (increase / questionsCount) * incorrectAnswersCount

    const coins = increase - decrease
    return coins
  }

  private getXp(
    isNextStarUnlocked: boolean,
    questionsCount: number,
    incorrectAnswersCount: number,
  ) {
    let increase = questionsCount * RewardUserUseCase.XP_INCREASE_BASE
    if (isNextStarUnlocked) increase /= 2

    const decrease = (increase / questionsCount) * incorrectAnswersCount

    const xp = increase - decrease
    return xp
  }

  private async saveStarReward(
    user: User,
    newCoins: number,
    newXp: number,
    nextStar: Star | null,
  ) {
    user.earnCoins(newCoins)
    user.earnXp(newXp)

    if (nextStar) {
      if (user.hasUnlockedStar(nextStar.id).isFalse) {
        const response = await this.spaceService.saveUserUnlockedStar(
          nextStar.id,
          user.id,
        )
        if (response.isFailure) response.throwError()
      }

      user.unlockStar(nextStar.id)
    }

    const response = await this.usersService.updateUser(user)
    if (response.isFailure) response.throwError()
  }

  private async fetchPlanet(starId: string) {
    const response = await this.spaceService.fetchPlanetByStar(starId)
    if (response.isFailure) response.throwError()

    return Planet.create(response.data)
  }
}
