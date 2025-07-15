import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Text } from '@stardust/core/global/structures'

type Schema = {
  body: {
    refreshToken: string
  }
}

export class RefreshSessionController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { refreshToken } = await http.getBody()
    return await this.service.refreshSession(Text.create(refreshToken))
  }
}
