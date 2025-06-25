import { Id } from '#global/domain/structures/Id'
import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'
import { ChallengeNotFoundError } from '../domain/errors'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  challengeSlug?: string
  starId?: string
}

type Response = Promise<ChallengeDto>

export class GetChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeSlug, starId }: Request) {
    if (challengeSlug) {
      const challenge = await this.repository.findBySlug(Slug.create(challengeSlug))
      if (!challenge) throw new ChallengeNotFoundError()
      return challenge.dto
    }

    if (starId) {
      const challenge = await this.repository.findByStar(Id.create(starId))
      if (!challenge) throw new ChallengeNotFoundError()
      return challenge.dto
    }

    throw new ChallengeNotFoundError()
  }
}
