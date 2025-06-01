import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { Password } from '@stardust/core/auth/structures'
import { Text } from '@stardust/core/global/structures'

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
    console.log(newPassword, accessToken, refreshToken)
    return await this.authService.resetPassword(
      Password.create(newPassword),
      Text.create(accessToken),
      Text.create(refreshToken),
    )
  }
}
