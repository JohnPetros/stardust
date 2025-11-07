import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'

import { COOKIES, ROUTES } from '@/constants'
import { cookieActions } from '@/rpc/next-safe-action'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Text } from '@stardust/core/global/structures'

const PUBLIC_ROUTES = [
  ROUTES.landing,
  ...Object.values(ROUTES.seo),
  ...Object.values(ROUTES.auth),
  ...Object.values(ROUTES.api.auth),
]

export const VerifyAuthRoutesController = (authService: AuthService): Controller => {
  async function refreshAuthSession(http: Http) {
    const refreshToken = await cookieActions.getCookie(COOKIES.refreshToken.key)
    if (!refreshToken?.data) {
      return new RestResponse<SessionDto>({ statusCode: HTTP_STATUS_CODE.unauthorized })
    }

    const response = await authService.refreshSession(Text.create(refreshToken.data))

    if (response.isSuccessful) {
      await Promise.all([
        http.setCookie(
          COOKIES.accessToken.key,
          response.body.accessToken,
          response.body.durationInSeconds,
        ),
        http.setCookie(
          COOKIES.refreshToken.key,
          response.body.refreshToken,
          response.body.durationInSeconds,
        ),
      ])
    }

    return response
  }

  return {
    async handle(http: Http) {
      const currentRoute = http.getCurrentRoute()
      const isSnippetPageRoute = currentRoute.includes(`${ROUTES.playground.snippets}/`)
      const isPublicRoute =
        PUBLIC_ROUTES.map(String).includes(currentRoute) || isSnippetPageRoute
      const response = await authService.fetchAccount()
      const hasSession = response.isSuccessful
      const isRootRoute = currentRoute === ROUTES.landing
      const isSignInRoute = currentRoute === ROUTES.auth.signIn

      if (!hasSession) {
        const response = await refreshAuthSession(http)
        if (response.isSuccessful) return http.redirect(currentRoute)
      }

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
