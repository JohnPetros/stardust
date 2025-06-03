import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { COOKIES, ROUTES } from '@/constants'
import { Slug } from '@stardust/core/global/structures'

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

      const response = await authService.confirmPasswordReset(token)

      if (response.isFailure) {
        http.deleteCookie(COOKIES.keys.shouldResetPassword)
        return redirectToSigInPage(http, response.errorMessage)
      }

      const accessToken = response.body.accessToken
      const refreshToken = response.body.refreshToken
      const cookieDuration = 60 * 15 // 15 minutes

      http.setCookie(COOKIES.keys.shouldResetPassword, 'true', cookieDuration)
      http.setCookie(COOKIES.keys.accessToken, accessToken, cookieDuration)
      http.setCookie(COOKIES.keys.refreshToken, refreshToken, cookieDuration)

      return http.redirect(ROUTES.auth.resetPassword)
    },
  }
}
