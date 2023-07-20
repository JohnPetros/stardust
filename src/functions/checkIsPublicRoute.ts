import { ROUTES } from "@/constants/routes";

export function checkIsPublicRoute(pathname: string){
  const publicRoutes = Object.values(ROUTES.public)

  return publicRoutes.includes(pathname)
}