import { Event } from '#global/domain/abstracts/Event'

export class StarsOrderChangedEvent extends Event {
  static readonly _NAME = 'space/stars.order.changed'

  constructor() {
    super(StarsOrderChangedEvent._NAME, {})
  }
}
