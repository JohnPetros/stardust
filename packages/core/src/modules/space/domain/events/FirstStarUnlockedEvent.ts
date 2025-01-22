import type { IEvent } from '#interfaces'

type Payload = {
  firstUnlockedStarId: string
}

export class FirstStarUnlockedEvent implements IEvent<Payload> {
  static readonly NAME = 'space/first.star.unlocked'
  constructor(readonly payload: Payload) {}

  get name() {
    return FirstStarUnlockedEvent.NAME
  }
}
