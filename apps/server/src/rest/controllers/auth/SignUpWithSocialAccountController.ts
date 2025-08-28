import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { UserSignedUpEvent } from '@stardust/core/auth/events'

type Schema = {
  body: AccountDto
}

export class SignUpWithSocialAccountController implements Controller<Schema> {
  constructor(private readonly eventBroker: EventBroker) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const accountDto = await http.getBody()

    const event = new UserSignedUpEvent({
      userId: String(accountDto.id),
      userEmail: accountDto.email,
      userName: accountDto.name,
    })

    await this.eventBroker.publish(event)

    return http.send({ isNewAccount: true })
  }
}
