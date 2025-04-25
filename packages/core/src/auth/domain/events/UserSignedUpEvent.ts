import { Event } from '#global/abstracts'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export class UserSignedUpEvent extends Event<Payload> {
  static readonly _NAME = 'auth/user.signed.up'

  constructor(payload: Payload) {
    super(UserSignedUpEvent._NAME, payload)
  }
}
