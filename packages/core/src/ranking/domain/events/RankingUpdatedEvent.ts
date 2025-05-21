import { Event } from '#global/domain/abstracts/index'

type Payload = {
  tierId: string
}

export class RankingUpdatedEvent extends Event<Payload> {
  static readonly _NAME = 'ranking/ranking.updated'

  constructor(payload: Payload) {
    super(RankingUpdatedEvent._NAME, payload)
  }
}
