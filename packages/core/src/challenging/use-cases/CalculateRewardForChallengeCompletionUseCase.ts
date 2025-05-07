import { Id, Percentage } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/index'
import { User } from '#profile/domain/entities/index'
import type { UserDto } from '#profile/domain/entities/dtos/index'
import type { ChallengingService } from '../interfaces'
import { Challenge } from '../domain/entities'

type Request = {
  userDto: UserDto
  challengeId: string
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
  constructor(private readonly challengingService: ChallengingService) {}

  async do({ userDto, challengeId, incorrectAnswersCount }: Request) {
    const user = User.create(userDto)
    const challenge = await this.fetchChallenge(Id.create(challengeId))
    await this.saveCompletedChallenge(challenge.id, user)

    const accuracyPercentage = this.calculateAccuracyPercentage(
      challenge,
      incorrectAnswersCount,
    )
    const newCoins = this.calculateCoins(challenge, accuracyPercentage)
    const newXp = this.calculateXp(challenge, accuracyPercentage)

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private calculateCoins(challenge: Challenge, accuracyPercentage: number) {
    return Math.floor(challenge.difficulty.reward.coins * (accuracyPercentage / 100))
  }

  private calculateXp(challenge: Challenge, accuracyPercentage: number) {
    return Math.floor(challenge.difficulty.reward.xp * (accuracyPercentage / 100))
  }

  private calculateAccuracyPercentage(
    challenge: Challenge,
    incorrectUserAnswersCount: number,
  ) {
    const percentage = Percentage.create(
      incorrectUserAnswersCount,
      challenge.maximumIncorrectAnswersCount,
    )
    return 100 - percentage.value
  }

  private async fetchChallenge(challengeId: Id) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  private async saveCompletedChallenge(challengeId: Id, user: User) {
    const isChallengeCompleted = user.hasCompletedChallenge(challengeId)
    if (isChallengeCompleted.isTrue) return

    const response = await this.challengingService.saveCompletedChallenge(
      challengeId,
      user.id,
    )
    if (response.isFailure) response.throwError()
  }
}
