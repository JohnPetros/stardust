import type { IChallengingService, IUseCase } from '#interfaces'
import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import { Challenge } from '#challenging/entities'

type Request = {
  challengeSlug: string
  userDto: UserDto
}

export class UnlockDocUseCase implements IUseCase<Request, void> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, challengeSlug }: Request) {
    const user = User.create(userDto)
    const challenge = await this.fetchChallenge(challengeSlug)
    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)

    const shouldUnlockDoc =
      isChallengeCompleted.isFalse &&
      challenge.isFromStar.isTrue &&
      challenge.docId &&
      user.hasUnlockedDoc(challenge.docId.value).isFalse

    if (shouldUnlockDoc) {
      await this.challengingService.saveUnlockedDoc(challenge.docId.value, user.id)
    }
  }

  private async fetchChallenge(challengeSlug: string) {
    const response = await this.challengingService.fetchChallengeBySlug(challengeSlug)
    if (!response.isFailure) response.throwError()

    return Challenge.create(response.body)
  }
}
