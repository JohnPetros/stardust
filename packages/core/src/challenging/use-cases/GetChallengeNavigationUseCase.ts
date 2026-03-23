import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeNavigationDto } from '../domain/structures/dtos'
import { ChallengeNotFoundError } from '../domain/errors'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  challengeSlug: string
}

type Response = Promise<ChallengeNavigationDto>

export class GetChallengeNavigationUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeSlug }: Request) {
    const challengeNavigation = await this.repository.findChallengeNavigationBySlug(
      Slug.create(challengeSlug),
    )

    if (!challengeNavigation) {
      throw new ChallengeNotFoundError()
    }

    return challengeNavigation.dto
  }
}
