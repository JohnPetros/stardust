import { ENV } from '@/constants'
import { AuthError } from '@stardust/core/global/errors'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

export class VerifyGodAccountController implements Controller {
  async handle(http: Http): Promise<RestResponse> {
    const accountId = await http.getAccountId()
    if (accountId !== ENV.godAccountId) {
      throw new AuthError('Esta conta não é o administrador do sistema')
    }
    return http.pass()
  }
}
