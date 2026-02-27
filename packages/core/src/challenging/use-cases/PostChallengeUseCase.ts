import type { ChallengesRepository } from '../interfaces'
import type { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'
import type { Broker } from '#global/interfaces/Broker'
import { Challenge } from '../domain/entities'
import { ChallengeAlreadyExistsError } from '../domain/errors'
import { ChallengePostedEvent } from '../domain/events'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create({ ...challengeDto, isNew: true })
    await this.findChallenge(challenge.slug)
    await this.repository.add(challenge)
    const event = new ChallengePostedEvent({
      challengeSlug: challenge.slug.value,
      challengeTitle: challenge.title.value,
      challengeAuthor: challenge.author.dto,
    })
    await this.broker.publish(event)
    return challenge.dto
  }

  private async findChallenge(challengeSlug: Slug) {
    const challenge = await this.repository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }
}
