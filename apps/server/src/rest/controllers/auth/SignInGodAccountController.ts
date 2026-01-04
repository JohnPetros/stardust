import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Password } from '@stardust/core/auth/structures'
import { Email } from '@stardust/core/global/structures'
import { NotGodAccountError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

type Schema = {
  body: {
    email: string
    password: string
  }
}

export class SignInGodAccountController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password } = await http.getBody()
    const response = await this.service.signIn(
      Email.create(email),
      Password.create(password),
    )
    if (response.isFailure) response.throwError()

    if (response.body.account.id !== ENV.godAccountId) {
      throw new NotGodAccountError()
    }

    return response
  }
}
