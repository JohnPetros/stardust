import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  accountId: string
  platform: string
}

export class AccountSignedInEvent extends Event<Payload> {
  static readonly _NAME = 'auth/account.signed.in'

  constructor(payload: Payload) {
    super(AccountSignedInEvent._NAME, payload)
  }
}
