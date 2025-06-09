import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { COOKIES, ROUTES } from '@/constants'

export const SignOutAction = (authService: AuthService): Action => {
  return {
    async handle(call: Call) {
      const response = await authService.signOut()
      if (response.isFailure) response.throwError()

      await Promise.all([
        call.deleteCookie(COOKIES.accessToken.key),
        call.deleteCookie(COOKIES.refreshToken.key),
      ])
      call.redirect(ROUTES.auth.signIn)
    },
  }
}
