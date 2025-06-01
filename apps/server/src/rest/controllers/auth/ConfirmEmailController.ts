import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'

type Schema = {
  body: {
    token: string
  }
}

export class ConfirmEmailController implements Controller<Schema> {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { token } = await http.getBody()
    return await this.authService.confirmEmail(Text.create(token))
  }
}
