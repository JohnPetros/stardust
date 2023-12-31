import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'

import { AuthController } from './services/api/authController'
import { ROUTES } from './utils/constants'
import { checkIsPublicRoute } from './utils/helpers'

import type { Database } from '@/@types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const currentRoute = '/' + req.nextUrl.pathname.split('/')[1]
  const isPublicRoute = checkIsPublicRoute(currentRoute)

  const authController = AuthController(supabase)

  const hasSession = Boolean(await authController.getUserId())

  console.log({ hasSession })

  if (hasSession && currentRoute === ROUTES.public.signIn) {
    return NextResponse.redirect(new URL(ROUTES.private.home, req.url))
  }

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
