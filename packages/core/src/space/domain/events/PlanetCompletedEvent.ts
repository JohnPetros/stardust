import { Event } from '#global/domain/abstracts/index'

type Payload = {
  userSlug: string
  userName: string
  planetName: string
}

export class PlanetCompletedEvent extends Event<Payload> {
  static readonly _NAME = 'space/completed.planet'

  constructor(payload: Payload) {
    super(PlanetCompletedEvent._NAME, payload)
  }
}
