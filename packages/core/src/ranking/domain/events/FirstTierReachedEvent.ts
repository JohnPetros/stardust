import { Event } from '#global/domain/abstracts/index'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  firstTierId: string
  firstStarId: string
}

export class FirstTierReachedEvent extends Event<Payload> {
  static readonly _NAME = 'ranking/first.tier.reached'

  constructor(payload: Payload) {
    super(FirstTierReachedEvent._NAME, payload)
  }
}
