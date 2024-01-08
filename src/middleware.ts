import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'

import { AuthController } from './services/api/authController'
import { ROUTES } from './utils/constants'
import { checkIsPublicRoute } from './utils/helpers'
import { getSearchParams } from './utils/helpers/getSearchParams'

import type { Database } from '@/@types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const hasRedirect = getSearchParams(req.url, 'redirect_to')

  console.log(req.url)
  console.log({ hasRedirect })
  //https://aukqejqsiqsqowafpppb.supabase.co/auth/v1/verify?token=pkce_baa24ae8299f1a47da82f4865b9ba1fa79295a3ea98e2b00016a7389&type=recovery&redirect_to=http%3A%2F%2Flocalhost%3A3000%2F%2F%2Fserver%2Fauth%2Fconfirm%3Faccess_token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NzU3ODZ9.dQ6oWaAgI29My9FCLULf1XcmIIGOe6arqryX6Nu2mOE%26type%3Dpassword-reset

  if (hasRedirect) {
    return NextResponse.redirect(new URL(hasRedirect, req.url))
  }

  const currentRoute = '/' + req.nextUrl.pathname.split('/')[1]

  const isPublicRoute = checkIsPublicRoute(currentRoute)

  const authController = AuthController(supabase)

  const hasSession = Boolean(await authController.getUserId())

  if (hasSession && currentRoute === ROUTES.public.signIn) {
    return NextResponse.redirect(new URL(ROUTES.private.home, req.url))
  }

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
