import type { ChallengeSourcesRepository, ChallengesRepository } from '../interfaces'
import type { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'
import type { Broker } from '#global/interfaces/Broker'
import { Challenge } from '../domain/entities'
import {
  ChallengeAlreadyExistsError,
  ChallengeSourceNotFoundError,
} from '../domain/errors'
import { ChallengePostedEvent } from '../domain/events'
import { Id } from '#global/domain/structures/Id'

type Request = {
  challengeDto: ChallengeDto
  challengeSourceId?: string | null
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ challengeDto, challengeSourceId }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.findChallenge(challenge.slug)
    await this.challengesRepository.add(challenge)
    const event = new ChallengePostedEvent({
      challengeSlug: challenge.slug.value,
      challengeTitle: challenge.title.value,
      challengeAuthor: challenge.author.dto,
    })
    console.log('challengeSourceId', challengeSourceId)
    if (challengeSourceId)
      await this.markChallengeSourceAsUsed(Id.create(challengeSourceId), challenge)

    await this.broker.publish(event)
    return challenge.dto
  }

  private async findChallenge(challengeSlug: Slug) {
    const challenge = await this.challengesRepository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }

  private async markChallengeSourceAsUsed(challengeSourceId: Id, challenge: Challenge) {
    const challengeSource =
      await this.challengeSourcesRepository.findById(challengeSourceId)
    if (!challengeSource) throw new ChallengeSourceNotFoundError()
    challengeSource.linkToChallenge(challenge)
    await this.challengeSourcesRepository.replace(challengeSource)
    return challengeSource
  }
}
