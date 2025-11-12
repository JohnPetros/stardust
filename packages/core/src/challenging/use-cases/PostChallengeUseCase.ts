import type { ChallengesRepository } from '../interfaces'
import type { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'
import { Challenge } from '../domain/entities'
import { ChallengeAlreadyExistsError } from '../domain/errors'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.findChallenge(challenge.slug)
    await this.repository.add(challenge)
    return challenge.dto
  }

  private async findChallenge(challengeSlug: Slug) {
    const challenge = await this.repository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }
}
