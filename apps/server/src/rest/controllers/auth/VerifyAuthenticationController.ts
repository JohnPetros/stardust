import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'

export class VerifyAuthenticationController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(_http: Http): Promise<RestResponse<AccountDto>> {
    const response = await this.authService.fetchAccount()
    if (response.isFailure) {
      response.throwError()
    }
    return response
  }
}
