import type { IEvent } from '#interfaces'

type Payload = {
  firstUnlockedStarId: string
}

export class FirstStarUnlockedEvent implements IEvent<Payload> {
  static readonly name = 'space/first.star.unlocked'
  constructor(readonly payload: Payload) {}

  get name() {
    return FirstStarUnlockedEvent.name
  }
}
