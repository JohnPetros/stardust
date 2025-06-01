import { Event } from '#global/domain/abstracts/index'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export class UserCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/user.created'

  constructor(readonly payload: Payload) {
    super(UserCreatedEvent._NAME, payload)
  }
}
