import {
  ConfirmPasswordResetUnexpectedError,
  TokenNotFoundError,
} from '@/@core/errors/auth'
import { BaseError } from '@/@core/errors/global/BaseError'
import { IController, IHttp } from '@/@core/interfaces/handlers'
import { IAuthService } from '@/@core/interfaces/services'

import { COOKIES, ROUTES } from '@/modules/global/constants'

export const ConfirmPasswordResetController = (
  authService: IAuthService
): IController => {
  function redirectToSigInPage(http: IHttp, error: BaseError) {
    return http.redirect(`${ROUTES.public.signIn}?error=${error.message}`)
  }

  return {
    async handle(http: IHttp) {
      const token = http.getSearchParam('token')

      if (!token) return redirectToSigInPage(http, new TokenNotFoundError())

      const response = await authService.confirmPasswordReset(token)

      if (response.isFailure)
        return redirectToSigInPage(http, new ConfirmPasswordResetUnexpectedError())

      const accessToken = response.data.accessToken
      const refreshToken = response.data.refreshToken
      const cookieDuration = 60 * 15 // 15 minutes

      http.setCookie({
        key: COOKIES.keys.shouldReturnPassword,
        value: 'true',
        duration: cookieDuration,
      })

      http.setCookie({
        key: COOKIES.keys.accessToken,
        value: accessToken,
        duration: cookieDuration,
      })

      http.setCookie({
        key: COOKIES.keys.refreshToken,
        value: refreshToken,
        duration: cookieDuration,
      })

      return http.send(null, 200)
    },
  }
}
