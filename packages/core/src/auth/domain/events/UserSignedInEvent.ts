import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  userId: string
  platform: string
}

export class UserSignedInEvent extends Event<Payload> {
  static readonly _NAME = 'auth/user.signed.in'

  constructor(payload: Payload) {
    super(UserSignedInEvent._NAME, payload)
  }
}
