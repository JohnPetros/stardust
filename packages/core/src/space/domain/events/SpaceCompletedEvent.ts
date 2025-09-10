import { Event } from '#global/domain/abstracts/index'

type Payload = {
  userSlug: string
  userName: string
}

export class SpaceCompletedEvent extends Event<Payload> {
  static readonly _NAME = 'space/completed.space'

  constructor(payload: Payload) {
    super(SpaceCompletedEvent._NAME, payload)
  }
}
