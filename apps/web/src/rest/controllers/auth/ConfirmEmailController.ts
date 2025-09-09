import { Slug, Text } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { COOKIES, ROUTES } from '@/constants'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmEmailController = (authService: AuthService): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const { token } = http.getQueryParams()
      const response = await authService.confirmEmail(Text.create(token))

      console.log(response)

      if (response.isSuccessful) {
        http.setCookie(
          COOKIES.accessToken.key,
          response.body.accessToken,
          response.body.durationInSeconds,
        )
        http.setCookie(
          COOKIES.refreshToken.key,
          response.body.refreshToken,
          COOKIES.refreshToken.durationInSeconds,
        )
        return http.redirect(ROUTES.auth.accountConfirmation)
      }

      const errorQueryParam = Slug.create(response.errorMessage).value
      return http.redirect(`${ROUTES.auth.signIn}?error=${errorQueryParam}`)
    },
  }
}
