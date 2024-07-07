import { IController, IHttp } from '@/@core/interfaces/handlers'
import { IAuthService } from '@/@core/interfaces/services'
import { ROUTES } from '@/modules/global/constants'
import { NextResponse } from 'next/server'

type Response = NextResponse | undefined

export const CheckAuthRoutesController = (
  authService: IAuthService
): IController<Response> => {
  function checkPublicRoute(route: string) {
    const publicRoutes = Object.values(ROUTES.public)
    return publicRoutes.includes(route) || route === '/server'
  }

  return {
    async handle(http: IHttp<Response>) {
      const currentRoute = http.getCurrentRoute()
      const isPublicRoute = checkPublicRoute(currentRoute)

      const response = await authService.getUserId()
      const hasSession = response.isSuccess

      if (!hasSession && !isPublicRoute) return http.redirect(ROUTES.public.landing)

      if (currentRoute === '/') return http.redirect(ROUTES.public.landing)
    },
  }
}
