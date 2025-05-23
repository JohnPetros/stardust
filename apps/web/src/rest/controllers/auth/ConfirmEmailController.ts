import { Slug } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { ROUTES } from '@/constants'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmEmailController = (authService: AuthService): Controller<Schema> => {
  function redirectToSigInPage(http: Http, errorMessage: string) {
    return http.redirect(`${ROUTES.auth.signIn}?error=${Slug.create(errorMessage).value}`)
  }

  return {
    async handle(http: Http<Schema>) {
      const { token } = http.getQueryParams()
      const response = await authService.confirmEmail(token)
      if (response.isSuccessful) return http.redirect(ROUTES.auth.accountConfirmation)
      return redirectToSigInPage(http, response.errorMessage)
    },
  }
}
