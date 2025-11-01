import { Event } from '#global/domain/abstracts/Event'

export class PlanetsOrderChangedEvent extends Event {
  static readonly _NAME = 'space/planets.order.changed'

  constructor() {
    super(PlanetsOrderChangedEvent._NAME, {})
  }
}
