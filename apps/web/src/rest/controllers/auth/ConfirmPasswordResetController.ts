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
  return {
    async handle(http: Http<Schema>) {
      const { token } = http.getQueryParams()
      const response = await authService.confirmPasswordReset(Text.create(token))

      if (response.isSuccessful) {
        const session = response.body
        http.setCookie(
          COOKIES.shouldResetPassword.key,
          'true',
          COOKIES.shouldResetPassword.durationInSeconds,
        )
        http.setCookie(
          COOKIES.accessToken.key,
          session.accessToken,
          session.durationInSeconds,
        )
        http.setCookie(
          COOKIES.refreshToken.key,
          session.refreshToken,
          COOKIES.refreshToken.durationInSeconds,
        )
        return http.redirect(ROUTES.auth.resetPassword)
      }

      http.deleteCookie(COOKIES.shouldResetPassword.key)
      const errorQueryParam = Slug.create(response.errorMessage).value
      return http.redirect(`${ROUTES.auth.signIn}?error=${errorQueryParam}`)
    },
  }
}
