import { redirect } from 'react-router'

import { ROUTES, SESSION_STORAGE_KEYS } from '@/constants'
import { authContext } from '../contexts/authContext'

export const AuthMiddleware = async ({
  context,
  request,
}: {
  request: Request
  context: any
}) => {
  const accessToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.accessToken)
  const isSignInRoute = request.url.endsWith(ROUTES.index)

  if (!accessToken && !isSignInRoute) {
    throw redirect(ROUTES.index)
  }

  if (accessToken && isSignInRoute) {
    throw redirect(ROUTES.space.planets)
  }

  context.set(authContext, {
    accessToken,
  })
}
