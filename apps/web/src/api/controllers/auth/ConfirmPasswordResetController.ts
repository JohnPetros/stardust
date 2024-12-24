import type { IAuthService, IController, IHttp } from '@stardust/core/interfaces'

import { COOKIES, ROUTES } from '@/constants'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

type Schema = {
  queryParams: {
    token: string
  }
}

export const ConfirmPasswordResetController = (
  authService: IAuthService,
): IController<Schema> => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(`${ROUTES.auth.signIn}?error=${errorMessage}`)
  }

  return {
    async handle(http: IHttp<Schema>) {
      const { token } = http.getQueryParams()

      const response = await authService.confirmPasswordReset(token)

      if (response.isFailure)
        return redirectToSigInPage(
          http,
          'Erro inesperado ao confirmar redefinição de senha',
        )

      const accessToken = response.body.accessToken
      const refreshToken = response.body.refreshToken
      const cookieDuration = 60 * 15 // 15 minutes

      http.setCookie(COOKIES.keys.shouldReturnPassword, 'true', cookieDuration)
      http.setCookie(COOKIES.keys.accessToken, accessToken, cookieDuration)
      http.setCookie(COOKIES.keys.refreshToken, refreshToken, cookieDuration)

      return http.send(null, HTTP_STATUS_CODE.noContent)
    },
  }
}
