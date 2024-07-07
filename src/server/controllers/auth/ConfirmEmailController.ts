import { NextResponse } from 'next/server'

import { ConfirmEmailFailedError, TokenNotFoundError } from '@/@core/errors/auth'
import { BaseError } from '@/@core/errors/global/BaseError'
import { IController, IHttp } from '@/@core/interfaces/handlers'
import { IAuthService } from '@/@core/interfaces/services'

import { ROUTES } from '@/modules/global/constants'

export const ConfirmEmailController = (
  authService: IAuthService
): IController<NextResponse> => {
  function redirectToSigInPage(http: IHttp<NextResponse>, error: BaseError) {
    return http.redirect(`${ROUTES.public.signIn}?error=${error.message}`)
  }

  return {
    async handle(http: IHttp<NextResponse>) {
      const token = http.getSearchParam('token')

      if (!token) return redirectToSigInPage(http, new TokenNotFoundError())

      const response = await authService.confirmEmail(token)

      if (response.isSuccess) return http.redirect(ROUTES.private.app.authConfirmation)

      return redirectToSigInPage(http, new ConfirmEmailFailedError())
    },
  }
}
