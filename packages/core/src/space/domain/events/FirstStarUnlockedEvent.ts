import { Event } from '#global/domain/abstracts/index'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  firstStarId: string
}

export class FirstStarUnlockedEvent extends Event<Payload> {
  static readonly _NAME = 'space/first.star.unlocked'

  constructor(payload: Payload) {
    super(FirstStarUnlockedEvent._NAME, payload)
  }
}
