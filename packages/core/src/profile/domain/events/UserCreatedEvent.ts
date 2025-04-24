import { Event } from '#global/abstracts'

type Payload = {
  userId: string
}

export class UserCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/user.created'

  constructor(readonly payload: Payload) {
    super(UserCreatedEvent._NAME, payload)
  }
}
