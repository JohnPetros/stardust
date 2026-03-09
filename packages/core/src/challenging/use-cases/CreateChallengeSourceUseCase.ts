import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/index'
import type { ChallengeSourceDto } from '../domain/entities/dtos'
import { ChallengeSource, type Challenge } from '../domain/entities'
import {
  ChallengeNotFoundError,
  ChallengeSourceAlreadyExistsError,
} from '../domain/errors'
import type { ChallengeSourcesRepository, ChallengesRepository } from '../interfaces'

type Request = {
  challengeId?: string | null
  url: string
}

type Response = Promise<ChallengeSourceDto>

export class CreateChallengeSourceUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async execute({ challengeId, url }: Request): Response {
    const challenge = await this.findChallengeIfProvided(challengeId)

    if (challenge) {
      await this.verifyIfChallengeSourceExists(challenge.id)
    }

    const challengeSource = await this.createChallengeSource(challenge, url)

    await this.challengeSourcesRepository.add(challengeSource)
    return challengeSource.dto
  }

  private async findChallenge(challengeId: Id): Promise<Challenge> {
    const challenge = await this.challengesRepository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }

  private async findChallengeIfProvided(
    challengeId?: string | null,
  ): Promise<Challenge | null> {
    if (!challengeId) {
      return null
    }

    return this.findChallenge(Id.create(challengeId))
  }

  private async verifyIfChallengeSourceExists(challengeId: Id): Promise<void> {
    const challengeSource =
      await this.challengeSourcesRepository.findByChallengeId(challengeId)
    if (challengeSource) throw new ChallengeSourceAlreadyExistsError()
  }

  private async createChallengeSource(
    challenge: Challenge | null,
    url: string,
  ): Promise<ChallengeSource> {
    const challengeSources = await this.challengeSourcesRepository.findAll()
    const lastPosition = challengeSources.reduce((position, challengeSource) => {
      return Math.max(position, challengeSource.position.value)
    }, 0)

    return ChallengeSource.create({
      id: Id.create().value,
      url,
      position: lastPosition + 1,
      challenge: challenge
        ? {
            id: challenge.id.value,
            title: challenge.title.value,
            slug: challenge.slug.value,
          }
        : null,
    })
  }
}
