import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { Email } from '@stardust/core/global/structures'
import { ENV } from '@/constants/env'

type Schema = {
  body: {
    email: string
  }
}

export class ResendSignUpEmailController implements Controller<Schema> {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email } = await http.getBody()
    await this.authService.resendSignUpEmail(Email.create(email))
    return http.send({ webAppUrl: ENV.webAppUrl })
  }
}
