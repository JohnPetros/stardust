import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IAuthService } from '@stardust/core/interfaces'
import { ROUTES } from '@/constants'

const PUBLIC_ROUTES = [
  ROUTES.landing,
  ...Object.values(ROUTES.auth),
  ...Object.values(ROUTES.api.auth),
]

export const VerifyAuthRoutesController = (authService: IAuthService): IController => {
  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()
      const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute)

      const response = await authService.fetchUserId()
      const hasSession = response.isSuccess
      const isRootRoute = currentRoute === '/'

      if (!hasSession && !isPublicRoute) {
        return http.redirect(ROUTES.auth.signIn)
      }

      if (!hasSession && isRootRoute) {
        return http.redirect(ROUTES.landing)
      }

      if (hasSession && isRootRoute) {
        return http.redirect(ROUTES.space)
      }

      return http.pass()
    },
  }
}
