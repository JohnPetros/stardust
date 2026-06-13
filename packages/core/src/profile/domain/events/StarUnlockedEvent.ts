import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  userId: string
  starId: string
}

export class StarUnlockedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/star.unlocked'

  constructor(readonly payload: Payload) {
    super(StarUnlockedEvent._NAME, payload)
  }
}
