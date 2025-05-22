import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  queryParams: {
    token: string
  }
}

export class ConfirmPasswordResetController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { token } = http.getQueryParams()
    return await this.authService.confirmPasswordReset(token)
  }
}
