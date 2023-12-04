import { ROUTES } from '@/utils/constants/routes'

export function checkIsPublicRoute(route: string) {
  const publicRoutes = Object.values(ROUTES.public)

  return publicRoutes.includes(route) || route === '/server'
}
