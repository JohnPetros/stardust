import { Text } from '@stardust/core/global/structures'
import { UserSignedInEvent } from '@stardust/core/auth/events'
import { AppError } from '@stardust/core/global/errors'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http, Broker } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  body: {
    token: string
  }
}

export class ConfirmEmailController implements Controller<Schema> {
  constructor(
    private readonly service: AuthService,
    private readonly broker: Broker,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { token } = await http.getBody()
    const response = await this.service.confirmEmail(Text.create(token))

    if (response.isSuccessful) {
      const accountId = response.body.account.id
      if (!accountId) throw new AppError('Account ID is required')
      const event = new UserSignedInEvent({
        userId: accountId,
        platform: 'web',
      })
      await this.broker.publish(event)
    }

    return response
  }
}
