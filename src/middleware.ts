import { type NextRequest, NextResponse } from 'next/server'

import { _hasCookie } from './global/actions/_hasCookie'
import { COOKIES, ROUTES } from './global/constants'
import { checkPublicRoute } from './global/helpers'
import { getSearchParams } from './global/helpers/getSearchParams'
import { SupabaseMiddlewareClient } from './services/api/supabase/clients/SupabaseMiddlewareClient'
import { SupabaseAuthController } from './services/api/supabase/controllers/SupabaseAuthController'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const supabase = SupabaseMiddlewareClient({ req, res })
  const hasRedirect = getSearchParams(req.url, 'redirect_to')

  if (hasRedirect) return NextResponse.redirect(new URL(hasRedirect, req.url))

  const currentRoute = '/' + req.nextUrl.pathname.split('/')[1]
  const isPublicRoute = checkPublicRoute(currentRoute)
  const authController = SupabaseAuthController(supabase)
  const hasSession = Boolean(await authController.getUserId())

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }

  if (currentRoute === ROUTES.private.rewards) {
    const hasRewardsPayloadCookie = await _hasCookie(
      COOKIES.keys.rewardsPayload
    )

    if (!hasRewardsPayloadCookie)
      return NextResponse.redirect(new URL(ROUTES.private.home.space, req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
