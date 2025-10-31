import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reorderedStarIds: string[]
}

export class SpaceOrderChangedEvent extends Event {
  static readonly _NAME = 'space/space.order.changed'

  constructor(payload: Payload) {
    super(SpaceOrderChangedEvent._NAME, payload)
  }
}
