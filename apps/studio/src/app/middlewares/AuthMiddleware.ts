import { redirect } from 'react-router'

import { ROUTES, SESSION_STORAGE_KEYS } from '@/constants'
import { authContext } from '../contexts/AuthContext'

export const AuthMiddleware = async ({
  context,
  request,
}: {
  request: Request
  context: any
}) => {
  const accessToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.accessToken)
  const isSignInRoute = request.url.endsWith(ROUTES.index)
  const normalizedAccessToken = accessToken?.replaceAll('"', '').trim() ?? ''
  const hasSession = Boolean(normalizedAccessToken)

  if (!hasSession && !isSignInRoute) {
    throw redirect(ROUTES.index)
  }

  if (hasSession && isSignInRoute) {
    throw redirect(ROUTES.dashboard)
  }

  context.set(authContext, {
    accessToken: normalizedAccessToken,
  })
}
