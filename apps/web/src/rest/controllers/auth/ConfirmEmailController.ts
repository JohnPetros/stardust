import { Slug, Text } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { ROUTES } from '@/constants'

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
      if (response.isSuccessful) return http.redirect(ROUTES.auth.accountConfirmation)

      const errorQueryParam = Slug.create(response.errorMessage).value
      return http.redirect(`${ROUTES.auth.signIn}?error=${errorQueryParam}`)
    },
  }
}
