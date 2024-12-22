import { Slug } from '@stardust/core/global/structs'
import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IAuthService } from '@stardust/core/interfaces'

import { ROUTES } from '@/constants'

export const ConfirmEmailController = (authService: IAuthService): IController => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(
      `${ROUTES.public.auth.signIn}?error=${Slug.create(errorMessage).value}`,
    )
  }

  return {
    async handle(http: IHttp) {
      const token = http.getSearchParam('token')

      if (!token) return redirectToSigInPage(http, 'Token de confirmação não encontrado')

      const response = await authService.confirmEmail(token)
      if (response.isSuccess) return http.redirect(ROUTES.private.accountConfirmation)

      return redirectToSigInPage(http, response.errorMessage)
    },
  }
}
