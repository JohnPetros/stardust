import { IController, IHttp } from '@/@core/interfaces/handlers'
import { IAuthService } from '@/@core/interfaces/services'
import { HttpResponse } from '@/@core/responses'
import { ROUTES } from '@/modules/global/constants'

export const CheckAuthRoutesController = (authService: IAuthService): IController => {
  function checkPublicRoute(route: string) {
    const publicRoutes = Object.values(ROUTES.public)
    return publicRoutes.includes(route) || route === '/server'
  }

  return {
    async handle(http: IHttp) {
      const currentRoute = http.getCurrentRoute()
      const isPublicRoute = checkPublicRoute(currentRoute)

      const response = await authService.getUserId()
      const hasSession = response.isSuccess

      if (!hasSession && !isPublicRoute) return http.redirect(ROUTES.public.landing)

      if (!hasSession && currentRoute === '/') return http.redirect(ROUTES.public.landing)

      if (hasSession && currentRoute === '/')
        return http.redirect(ROUTES.private.app.home.space)

      return new HttpResponse(null)
    },
  }
}
