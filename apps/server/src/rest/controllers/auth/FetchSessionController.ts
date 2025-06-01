import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'

export class FetchSessionController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(_: Http): Promise<RestResponse> {
    return await this.authService.fetchAccount()
  }
}
