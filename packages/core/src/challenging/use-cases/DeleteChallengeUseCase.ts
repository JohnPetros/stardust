import type { Database } from '#global/interfaces/Database'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengesRepository } from '../interfaces'
import { Id } from '#global/domain/structures/index'
import { ChallengeDeletedEvent } from '../domain/events'
import type { Challenge } from '../domain/entities'
import { ChallengeNotFoundError } from '../domain/errors'

type Request = {
  challengeId: string
}

export class DeleteChallengeUseCase implements UseCase<Request> {
  constructor(
    private readonly database: Database,
    private readonly repository: ChallengesRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ challengeId }: Request) {
    const challenge = await this.findChallenge(Id.create(challengeId))
    await this.repository.remove(challenge)
    await this.publishDeletion(challenge)
  }

  private async publishDeletion(challenge: Challenge) {
    await this.broker.publish(new ChallengeDeletedEvent(this.deletionPayload(challenge)))
  }

  private deletionPayload(challenge: Challenge) {
    return {
      challengeId: challenge.id.value,
      challengeSlug: challenge.slug.value,
      challengeTitle: challenge.title.value,
      challengeAuthor: challenge.author.dto,
    }
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }
}
