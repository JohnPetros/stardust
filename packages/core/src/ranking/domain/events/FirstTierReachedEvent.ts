import type { IEvent } from '../../../global/interfaces'

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

export class FirstTierReachedEvent implements IEvent<Payload> {
  static readonly NAME = 'ranking/first.tier.reached'
  constructor(readonly payload: Payload) {}

  get name() {
    return FirstTierReachedEvent.NAME
  }
}
