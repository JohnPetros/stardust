import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { Text } from '@stardust/core/global/structures'

type Schema = {
  queryParams: {
    returnUrl: string
  }
}

export class ConnectGoogleAccountController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>) {
    const { returnUrl } = http.getQueryParams()
    return await this.service.connectGoogleAccount(Text.create(returnUrl))
  }
}
