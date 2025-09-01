import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Text } from '@stardust/core/global/structures'

type Schema = {
  queryParams: {
    returnUrl: string
  }
}

export class SignInWithGoogleAccountController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { returnUrl } = http.getQueryParams()
    const response = await this.service.signInWithGoogleAccount(Text.create(returnUrl))

    if (response.isFailure) {
      return response
    }

    return http.redirect(response.body.signInUrl)
  }
}
