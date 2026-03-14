import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  accountId: string
  accountName: string
  accountEmail: string
}

export class AccountSignedUpEvent extends Event<Payload> {
  static readonly _NAME = 'auth/account.signed.up'

  constructor(payload: Payload) {
    super(AccountSignedUpEvent._NAME, payload)
  }
}
