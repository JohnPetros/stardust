import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'

type Schema = {
  body: AccountDto
}

export class SignUpWithSocialAccountController implements Controller<Schema> {
  constructor(private readonly broker: Broker) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const accountDto = await http.getBody()

    const event = new AccountSignedUpEvent({
      accountId: String(accountDto.id),
      accountEmail: accountDto.email,
      accountName: accountDto.name,
    })

    await this.broker.publish(event)

    return http.send({ isNewAccount: true })
  }
}
