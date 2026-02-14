import { Event } from '#global/domain/abstracts/Event'
import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'

type Payload = {
  challengeSlug: string
  challengeTitle: string
  challengeAuthor: AuthorAggregateDto
}

export class ChallengePostedEvent extends Event<Payload> {
  static readonly _NAME = 'challenging/challenge.posted'

  constructor(readonly payload: Payload) {
    super(ChallengePostedEvent._NAME, payload)
  }
}
