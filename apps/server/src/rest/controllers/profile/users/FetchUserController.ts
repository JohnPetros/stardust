import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  routeParams: {
    userId: string
  }
}

export class FetchUserController implements Controller<Schema> {
  async handle(http: Http<Schema>): Promise<RestResponse> {
    return http.sendJson({ message: 'Hello World' })
  }
}
