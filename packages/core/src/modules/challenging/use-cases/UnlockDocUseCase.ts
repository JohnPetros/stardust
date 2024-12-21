import { Challenge, User } from '#domain/entities'
import type { ChallengeDto, UserDto } from '#dtos'
import type { IChallengingService, IUseCase } from '#interfaces'

type Request = {
  challengeDto: ChallengeDto
  userDto: UserDto
}

export class UnlockDocUseCase implements IUseCase<Request, void> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, challengeDto }: Request) {
    const user = User.create(userDto)
    const challenge = Challenge.create(challengeDto)
    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)

    // const shouldUnlockDoc = isChallengeCompleted.isFalse && challenge.isFromStar.isTrue

    // if (shouldUnlockDoc) {
    //   const hasUnlockedDoc = user.hasUnlockedDoc(challenge.docId.value)

    //   if (hasUnlockedDoc.isFalse)
    //     await this.challengingService.saveUnlockedDoc(challenge.docId.value, user.id)
    // }
  }
}
