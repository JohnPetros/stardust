import type { Controller, EventBroker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { UserSignedUpEvent } from '@stardust/core/auth/events'

type Schema = {
  body: {
    email: string
    password: string
    name: string
  }
}

export class SignUpController implements Controller<Schema> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password, name } = await http.getBody()
    const response = await this.authService.signUp(email, password)

    if (response.isSuccess) {
      const event = new UserSignedUpEvent({
        userId: response.body.userId,
        userEmail: email,
        userName: name,
      })
      await this.eventBroker.publish(event)
    }

    return response
  }
}
