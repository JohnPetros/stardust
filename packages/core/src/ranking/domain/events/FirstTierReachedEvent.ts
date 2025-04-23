import { Event } from '#global/abstracts'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
  firstTierId: string
}

export class FirstTierReachedEvent extends Event<Payload> {
  static readonly _NAME = 'ranking/first.tier.reached'

  constructor(payload: Payload) {
    super(FirstTierReachedEvent._NAME, payload)
  }
}
