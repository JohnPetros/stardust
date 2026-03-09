import type { UseCase } from '#global/interfaces/UseCase'
import { Id, Name, Slug, Url } from '#global/domain/structures/index'
import type { ChallengeSourceDto } from '../domain/entities/dtos'
import type { ChallengeSourcesRepository, ChallengesRepository } from '../interfaces'
import {
  ChallengeNotFoundError,
  ChallengeSourceAlreadyExistsError,
  ChallengeSourceNotFoundError,
} from '../domain/errors'

type Request = {
  challengeSourceId: string
  url: string
  challengeId?: string | null
}

type Response = Promise<ChallengeSourceDto>

export class UpdateChallengeSourceUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async execute({ challengeSourceId, url, challengeId }: Request): Response {
    const challengeSource = await this.challengeSourcesRepository.findById(
      Id.create(challengeSourceId),
    )

    if (!challengeSource) {
      throw new ChallengeSourceNotFoundError()
    }

    challengeSource.url = Url.create(url)

    if (!challengeId) {
      challengeSource.challenge = null
    } else {
      const challenge = await this.challengesRepository.findById(Id.create(challengeId))

      if (!challenge) {
        throw new ChallengeNotFoundError()
      }

      const existingChallengeSource =
        await this.challengeSourcesRepository.findByChallengeId(challenge.id)

      if (
        existingChallengeSource &&
        existingChallengeSource.id.value !== challengeSource.id.value
      ) {
        throw new ChallengeSourceAlreadyExistsError()
      }

      challengeSource.challenge = {
        id: challenge.id,
        title: Name.create(challenge.title.value),
        slug: Slug.create(challenge.slug.value),
      }
    }

    await this.challengeSourcesRepository.replace(challengeSource)
    return challengeSource.dto
  }
}
