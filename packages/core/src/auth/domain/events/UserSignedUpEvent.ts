import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  userId: string
  userName: string
  userEmail: string
  userAccountProvider: string
}

export class UserSignedUpEvent extends Event<Payload> {
  static readonly _NAME = 'auth/user.signed.up'

  constructor(payload: Payload) {
    super(UserSignedUpEvent._NAME, payload)
  }
}
