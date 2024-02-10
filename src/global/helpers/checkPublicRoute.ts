import { ROUTES } from '@/global/constants/routes'

export function checkPublicRoute(route: string) {
  const publicRoutes = Object.values(ROUTES.public)

  return publicRoutes.includes(route) || route === '/server'
}
