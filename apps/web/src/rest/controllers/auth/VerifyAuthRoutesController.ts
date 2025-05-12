import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { ROUTES } from '@/constants'

const PUBLIC_ROUTES = [
  ROUTES.landing,
  ROUTES.api.serverless,
  ...Object.values(ROUTES.auth),
  ...Object.values(ROUTES.api.auth),
]

export const VerifyAuthRoutesController = (authService: AuthService): Controller => {
  return {
    async handle(http: Http) {
      const currentRoute = http.getCurrentRoute()
      const isSnippetPageRoute = currentRoute.includes(`${ROUTES.playground.snippets}/`)
      const isPublicRoute =
        PUBLIC_ROUTES.map(String).includes(currentRoute) || isSnippetPageRoute
      const response = await authService.fetchUserId()
      const hasSession = response.isSuccess
      const isRootRoute = currentRoute === '/'
      const isSignInRoute = currentRoute === ROUTES.auth.signIn

      if (!hasSession && !isPublicRoute) {
        return http.redirect(ROUTES.auth.signIn)
      }

      if (hasSession && isRootRoute) {
        return http.redirect(ROUTES.space)
      }

      if (hasSession && isSignInRoute) {
        return http.redirect(ROUTES.space)
      }

      return http.pass()
    },
  }
}
