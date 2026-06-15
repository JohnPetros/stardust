import { Event } from '#global/domain/abstracts/Event'
import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'

type Payload = {
  challengeId: string
  challengeSlug: string
  challengeTitle: string
  challengeAuthor: AuthorAggregateDto
}

export class ChallengeDeletedEvent extends Event<Payload> {
  static readonly _NAME = 'challenging/challenge.deleted'

  constructor(readonly payload: Payload) {
    super(ChallengeDeletedEvent._NAME, payload)
  }
}
