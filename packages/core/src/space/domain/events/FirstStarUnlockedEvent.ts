import type { IEvent } from '../../../global/interfaces'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  firstUnlockedStarId: string
}

export class FirstStarUnlockedEvent implements IEvent<Payload> {
  static readonly NAME = 'space/first.star.unlocked'
  constructor(readonly payload: Payload) {}

  get name() {
    return FirstStarUnlockedEvent.NAME
  }
}
