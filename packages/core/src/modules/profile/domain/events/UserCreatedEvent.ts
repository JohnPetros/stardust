import type { IEvent } from '#interfaces'

type Payload = {
  userId: string
}

export class UserCreatedEvent implements IEvent<Payload> {
  static readonly NAME = 'profile/user-created'

  constructor(readonly payload: Payload) {}

  get name() {
    return UserCreatedEvent.NAME
  }
}
