import { ChallengeStarAlreadyInUseError } from '#challenging/domain/errors/ChallengeStarAlreadyInUseError'
import {
  ChallengeNotFoundError,
  ChallengeIsAlreadyStarError,
} from '#challenging/domain/errors/index'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'

type Request = {
  challengeId: string
  starId: string
}

type Response = Promise<ChallengeDto>

export class EditChallengeStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeId, starId }: Request): Response {
    const challenge = await this.repository.findById(Id.create(challengeId))
    if (!challenge) throw new ChallengeNotFoundError()
    if (challenge.isStarChallenge.isTrue) throw new ChallengeIsAlreadyStarError()
    await this.findChallengeByStar(Id.create(starId))
    challenge.starId = Id.create(starId)
    await this.repository.replace(challenge)
    return challenge.dto
  }

  private async findChallengeByStar(starId: Id) {
    const challenge = await this.repository.findByStar(starId)
    if (challenge) throw new ChallengeStarAlreadyInUseError()
  }
}
