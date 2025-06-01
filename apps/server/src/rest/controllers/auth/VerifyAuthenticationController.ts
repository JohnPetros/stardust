import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

export class VerifyAuthenticationController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http): Promise<RestResponse> {
    const response = await this.authService.fetchAccount()
    if (response.isFailure) {
      response.throwError()
    }
    return http.pass()
  }
}
