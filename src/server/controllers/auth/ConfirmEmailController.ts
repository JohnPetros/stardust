import { Slug } from '@/@core/domain/structs/Slug'
import { TokenNotFoundError } from '@/@core/errors/auth'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IAuthService } from '@/@core/interfaces/services'

import { ROUTES } from '@/modules/global/constants'

export const ConfirmEmailController = (authService: IAuthService): IController => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(
      `${ROUTES.public.signIn}?error=${Slug.create(errorMessage).value}`
    )
  }

  return {
    async handle(http: IHttp) {
      const token = http.getSearchParam('token')

      if (!token) return redirectToSigInPage(http, new TokenNotFoundError().message)

      const response = await authService.confirmEmail(token)

      console.log('isFailure', response.isFailure)
      console.log('isSuccess', response.isSuccess)

      if (response.isSuccess) return http.redirect(ROUTES.private.app.accountConfirmation)

      return redirectToSigInPage(http, response.errorMessage)
    },
  }
}
