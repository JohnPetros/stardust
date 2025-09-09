import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

export class DisconnectGoogleAccountController implements Controller {
  constructor(private readonly authService: AuthService) {}

  async handle(_: Http) {
    return await this.authService.disconnectGoogleAccount()
  }
}
