import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'

type Schema = {
  body: {
    email: string
    password: string
  }
}

export class SignInController implements Controller<Schema> {
  constructor(private readonly authService: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password } = await http.getBody()
    return await this.authService.signIn(email, password)
  }
}
