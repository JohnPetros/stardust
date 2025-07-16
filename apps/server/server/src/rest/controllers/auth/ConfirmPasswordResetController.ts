import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'

type Schema = {
  body: {
    token: string
  }
}

export class ConfirmPasswordResetController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { token } = await http.getBody()
    return await this.authService.confirmPasswordReset(Text.create(token))
  }
}
