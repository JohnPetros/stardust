import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { Email } from '@stardust/core/global/structures'

type Schema = {
  body: {
    email: string
  }
}

export class RequestPasswordResetController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email } = await http.getBody()
    return await this.authService.requestPasswordReset(Email.create(email))
  }
}
