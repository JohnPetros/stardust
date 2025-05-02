import { Slug } from '@stardust/core/global/structures'
import type { IController, IHttp } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/global/interfaces'

import { ROUTES } from '@/constants'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmEmailController = (authService: AuthService): IController<Schema> => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(`${ROUTES.auth.signIn}?error=${Slug.create(errorMessage).value}`)
  }

  return {
    async handle(http: IHttp<Schema>) {
      const { token } = http.getQueryParams()
      const response = await authService.confirmEmail(token)
      if (response.isSuccess) return http.redirect(ROUTES.auth.accountConfirmation)
      return redirectToSigInPage(http, response.errorMessage)
    },
  }
}
