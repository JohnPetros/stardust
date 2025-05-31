import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Slug, Text } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmPasswordResetController = (
  authService: AuthService,
): Controller<Schema> => {
  function redirectToSigInPage(http: Http, errorMessage: string) {
    return http.redirect(`${ROUTES.auth.signIn}?error=${Slug.create(errorMessage).value}`)
  }

  return {
    async handle(http: Http<Schema>) {
      const { token } = http.getQueryParams()

      const response = await authService.confirmPasswordReset(Text.create(token))

      if (response.isFailure) {
        http.deleteCookie(COOKIES.shouldResetPassword.key)
        return redirectToSigInPage(http, response.errorMessage)
      }

      const accessToken = response.body.accessToken
      const refreshToken = response.body.refreshToken

      http.setCookie(
        COOKIES.shouldResetPassword.key,
        'true',
        COOKIES.shouldResetPassword.duration,
      )
      http.setCookie(COOKIES.accessToken.key, accessToken, COOKIES.accessToken.duration)
      http.setCookie(
        COOKIES.refreshToken.key,
        refreshToken,
        COOKIES.refreshToken.duration,
      )

      return http.redirect(ROUTES.auth.resetPassword)
    },
  }
}
