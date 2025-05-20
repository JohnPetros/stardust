import { Event } from '#global/domain/abstracts/index'

type Payload = {
  tierId: string
  winnersIds: string[]
}

export class RankingWinnersDefinedEvent extends Event<Payload> {
  static readonly _NAME = 'ranking/ranking.winners.defined'

  constructor(payload: Payload) {
    super(RankingWinnersDefinedEvent._NAME, payload)
  }
}
