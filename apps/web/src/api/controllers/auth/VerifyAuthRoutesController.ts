import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IAuthService } from '@stardust/core/interfaces'
import { ApiResponse } from '@stardust/core/responses'
import { ROUTES } from '@/constants'

export const VerifyAuthRoutesController = (authService: IAuthService): IController => {
  function verifyPublicRoute(route: string) {
    const publicRoutes = Object.values(ROUTES.public)
    return publicRoutes.includes(route) || route === '/api'
  }

  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()
      const isPublicRoute = verifyPublicRoute(currentRoute)

      const response = await authService.fetchUserId()
      const hasSession = response.isSuccess
      const isIndexRoute = currentRoute === '/'

      if (!hasSession && !isPublicRoute) {
        return http.redirect(ROUTES.public.auth.signIn)
      }

      if (!hasSession && isIndexRoute) {
        return http.redirect(ROUTES.public.landing)
      }

      if (hasSession && isIndexRoute) {
        return http.redirect(ROUTES.private.space)
      }

      return new ApiResponse()
    },
  }
}
