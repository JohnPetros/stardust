import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import type { IUseCase, IChallengingService } from '#interfaces'
import { Challenge } from '#challenging/entities'

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
  implements IUseCase<Request, Response>
{
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, challengeId, incorrectAnswersCount }: Request) {
    const user = User.create(userDto)
    const challenge = await this.fetchChallenge(challengeId)
    await this.saveCompletedChallenge(challenge.id, user)

    const newCoins = this.calculateCoins(challenge, user)
    const newXp = this.calculateXp(challenge, user)
    const accuracyPercentage = this.calculateAccuracyPercentage(
      challenge,
      incorrectAnswersCount,
    )

    return {
      newCoins,
      newXp,
      accuracyPercentage,
    }
  }

  private calculateCoins(challenge: Challenge, user: User) {
    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
    return challenge.difficulty.reward.coins / (isChallengeCompleted.isFalse ? 2 : 1)
  }

  private calculateXp(challenge: Challenge, user: User) {
    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
    return challenge.difficulty.reward.xp / (isChallengeCompleted.isFalse ? 2 : 1)
  }

  private calculateAccuracyPercentage(
    challenge: Challenge,
    incorrectUserAnswersCount: number,
  ) {
    return (
      (challenge.maximumIncorrectAnswersCount -
        incorrectUserAnswersCount / challenge.maximumIncorrectAnswersCount) *
      100
    )
  }

  private async fetchChallenge(challengeId: string) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  private async saveCompletedChallenge(challengeId: string, user: User) {
    const isChallengeCompleted = user.hasCompletedChallenge(challengeId)
    if (isChallengeCompleted.isFalse) return

    const response = await this.challengingService.saveCompletedChallenge(
      challengeId,
      user.id,
    )
    if (response.isFailure) response.throwError()
  }
}
