import type { IEvent } from '#interfaces'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export class UserSignedUpEvent implements IEvent<Payload> {
  static readonly NAME = 'auth/user.signed.up'

  constructor(readonly payload: Payload) {}

  get name() {
    return UserSignedUpEvent.NAME
  }
}
