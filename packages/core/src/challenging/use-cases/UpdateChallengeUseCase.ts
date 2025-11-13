import type { UseCase } from '#global/interfaces/UseCase'
import type { Id, Slug } from '#global/domain/structures/index'
import type { ChallengeDto } from '../domain/entities/dtos'
import type { ChallengesRepository } from '../interfaces'
import { Challenge } from '../domain/entities'
import { ChallengeAlreadyExistsError, ChallengeNotFoundError } from '../domain/errors'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class UpdateChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    const currentChallenge = await this.findChallenge(challenge.id)

    if (currentChallenge.hasSameTitle(challenge).isFalse) {
      await this.findChallengeBySlug(challenge.slug)
    }

    await this.repository.replace(challenge)
    return challenge.dto
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }

  private async findChallengeBySlug(challengeSlug: Slug) {
    const challenge = await this.repository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }
}
