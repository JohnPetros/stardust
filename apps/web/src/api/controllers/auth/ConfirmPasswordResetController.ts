import type { IAuthService, IController, IHttp } from '@stardust/core/interfaces'

import { COOKIES, ROUTES } from '@/constants'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'
import { Slug } from '@stardust/core/global/structs'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmPasswordResetController = (
  authService: IAuthService,
): IController<Schema> => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(`${ROUTES.auth.signIn}?error=${Slug.create(errorMessage).value}`)
  }

  return {
    async handle(http: IHttp<Schema>) {
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
