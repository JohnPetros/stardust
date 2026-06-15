import type { Broker, Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Password } from '@stardust/core/auth/structures'
import { Email } from '@stardust/core/global/structures'
import { AccountSignedInEvent } from '@stardust/core/auth/events'

type Schema = {
  body: {
    email: string
    password: string
  }
}

export class SignInController implements Controller<Schema> {
  constructor(
    private readonly service: AuthService,
    private readonly broker: Broker,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password } = await http.getBody()
    const response = await this.service.signIn(
      Email.create(email),
      Password.create(password),
    )
    if (response.isSuccessful) {
      await this.broker.publish(
        new AccountSignedInEvent({
          accountId: String(response.body.account.id),
          platform: 'web',
        }),
      )
    }

    return response
  }
}
