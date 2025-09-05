import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

export class FetchGithubAccountConnectionController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(_: Http): Promise<RestResponse> {
    return await this.authService.fetchGithubAccountConnection()
  }
}
