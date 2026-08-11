import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'

import { COOKIES, PUBLIC_ROUTE_GROUPS, PUBLIC_ROUTES, ROUTES } from '@/constants'
import * as cookieActions from '@/rpc/next-safe-action/cookieActions'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Text } from '@stardust/core/global/structures'
import { isSafeNextRoute } from '@/utils/is-safe-next-route'

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
      const isPublicRoute =
        PUBLIC_ROUTES.map(String).includes(currentRoute) ||
        PUBLIC_ROUTE_GROUPS.some((group) => currentRoute.startsWith(group))
      const isRootRoute = currentRoute === ROUTES.landing
      const isSignInRoute = currentRoute === ROUTES.auth.signIn
      const isPasswordResetRoute =
        currentRoute === ROUTES.auth.resetPassword ||
        currentRoute === ROUTES.api.auth.confirmPasswordReset

      if (isPasswordResetRoute) {
        const shouldResetPassword = await cookieActions.getCookie(
          COOKIES.shouldResetPassword.key,
        )

        if (shouldResetPassword?.data) return http.pass()
      }

      if (isPublicRoute && !isRootRoute && !isSignInRoute) {
        const accessToken = await cookieActions.getCookie(COOKIES.accessToken.key)

        if (accessToken?.data) {
          const response = await authService.fetchAccount()

          if (response.isFailure) {
            const refreshResponse = await refreshAuthSession(http)

            if (refreshResponse.isSuccessful) {
              return http.redirect(currentRoute)
            }

            await http.deleteCookie(COOKIES.accessToken.key)
            await http.deleteCookie(COOKIES.refreshToken.key)
            return http.redirect(currentRoute)
          }
        }

        return http.pass()
      }

      const response = await authService.fetchAccount()
      const hasSession = response.isSuccessful

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
        const { nextRoute } = http.getQueryParams() as { nextRoute?: string }
        return http.redirect(isSafeNextRoute(nextRoute) ? nextRoute : ROUTES.space)
      }

      return http.pass()
    },
  }
}
