import { Challenge, User } from '@/@core/domain/entities'
import type { ChallengeDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IDocsService } from '@/@core/interfaces/services'

type Request = {
  challengeDTO: ChallengeDTO
  userDTO: UserDTO
}

export class UnlockDocUseCase implements IUseCase<Request, void> {
  constructor(private readonly docsService: IDocsService) {}

  async do({ userDTO, challengeDTO }: Request) {
    const user = User.create(userDTO)
    const challenge = Challenge.create(challengeDTO)
    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)

    const shouldUnlockDoc = isChallengeCompleted.isFalse && challenge.isFromStar.isTrue

    if (shouldUnlockDoc) {
      const hasUnlockedDoc = user.hasUnlockedDoc(challenge.docId.value)

      if (hasUnlockedDoc.isFalse)
        await this.docsService.saveUnlockedDoc(challenge.docId.value, user.id)
    }
  }
}
