import {
  ChallengeNotFoundError,
  ChallengeIsNotStarChallengeError,
} from '#challenging/domain/errors/index'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'

type Request = {
  challengeId: string
}

type Response = Promise<void>

export class RemoveChallengeStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeId }: Request): Promise<void> {
    const challenge = await this.repository.findById(Id.create(challengeId))
    if (!challenge) throw new ChallengeNotFoundError()
    if (challenge.isStarChallenge.isFalse) throw new ChallengeIsNotStarChallengeError()
    challenge.starId = null
    await this.repository.replace(challenge)
  }
}
