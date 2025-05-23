import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  body: {
    newPassword: string
    accessToken: string
    refreshToken: string
  }
}

export class ResetPasswordController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { newPassword, accessToken, refreshToken } = await http.getBody()
    return await this.authService.resetPassword(newPassword, accessToken, refreshToken)
  }
}
