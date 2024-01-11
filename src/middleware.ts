import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'

import { AuthController } from './services/api/supabase/controllers/authController'
import type { Database } from './services/api/supabase/types/database'
import { ROUTES } from './utils/constants'
import { checkIsPublicRoute } from './utils/helpers'
import { getSearchParams } from './utils/helpers/getSearchParams'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const hasRedirect = getSearchParams(req.url, 'redirect_to')

  if (hasRedirect) {
    return NextResponse.redirect(new URL(hasRedirect, req.url))
  }

  const currentRoute = '/' + req.nextUrl.pathname.split('/')[1]

  const isPublicRoute = checkIsPublicRoute(currentRoute)

  const authController = AuthController(supabase)

  const hasSession = Boolean(await authController.getUserId())

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
