import type { Database } from '#global/interfaces/Database'
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
    private readonly database: Database,
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ challengeDto, challengeSourceId }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.persistNewChallenge(challenge)
    await this.linkSource(challengeSourceId, challenge)
    await this.broker.publish(this.postedEvent(challenge))
    return challenge.dto
  }

  private async findChallenge(challengeSlug: Slug) {
    const challenge = await this.challengesRepository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }

  private async markChallengeSourceAsUsed(challengeSourceId: Id, challenge: Challenge) {
    const challengeSource = await this.findSource(challengeSourceId)
    challengeSource.linkToChallenge(this.challengeLink(challenge))
    await this.challengeSourcesRepository.replace(challengeSource)
    return challengeSource
  }
  private postedEvent(challenge: Challenge) {
    return new ChallengePostedEvent({
      challengeSlug: challenge.slug.value,
      challengeTitle: challenge.title.value,
      challengeAuthor: challenge.author.dto,
    })
  }

  private async findSource(sourceId: Id) {
    const source = await this.challengeSourcesRepository.findById(sourceId)
    if (!source) throw new ChallengeSourceNotFoundError()
    return source
  }
  private async linkSource(sourceId: Request['challengeSourceId'], challenge: Challenge) {
    if (sourceId) await this.markChallengeSourceAsUsed(Id.create(sourceId), challenge)
  }

  private challengeLink(challenge: Challenge) {
    return { id: challenge.id, title: challenge.title, slug: challenge.slug }
  }
  private async persistNewChallenge(challenge: Challenge) {
    await this.findChallenge(challenge.slug)
    await this.challengesRepository.add(challenge)
  }
}
