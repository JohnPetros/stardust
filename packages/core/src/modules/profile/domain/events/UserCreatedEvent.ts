import type { IEvent } from '#interfaces'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export class UserCreatedEvent implements IEvent<Payload> {
  static readonly name = 'profile/user-created'
  constructor(readonly payload: Payload) {}

  get name() {
    return UserCreatedEvent.name
  }
}
