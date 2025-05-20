import { Event } from '#global/domain/abstracts/index'

type Payload = {
  tierId: string
  losersIds: string[]
}

export class RankingLosersDefinedEvent extends Event<Payload> {
  static readonly _NAME = 'ranking/ranking.losers.defined'

  constructor(payload: Payload) {
    super(RankingLosersDefinedEvent._NAME, payload)
  }
}
