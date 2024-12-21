import type { IAuthService, IController, IHttp } from '@stardust/core/interfaces'

import { COOKIES, ROUTES } from '@/constants'

export const ConfirmPasswordResetController = (
  authService: IAuthService,
): IController => {
  function redirectToSigInPage(http: IHttp, errorMessage: string) {
    return http.redirect(`${ROUTES.public.signIn}?error=${errorMessage}`)
  }

  return {
    async handle(http: IHttp) {
      const token = http.getSearchParam('token')
      if (!token) return redirectToSigInPage(http, 'Token não encontrado')

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

      return http.send(null, 200)
    },
  }
}
