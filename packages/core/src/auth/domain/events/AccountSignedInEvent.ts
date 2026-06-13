import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  accountId: string
  platform: 'web' | 'mobile'
}

export class AccountSignedInEvent extends Event<Payload> {
  static readonly _NAME = 'auth/account.signed.in'

  constructor(payload: Payload) {
    super(AccountSignedInEvent._NAME, payload)
  }
}
