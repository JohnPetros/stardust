import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'

import { ROUTES } from './utils/constants'
import { checkIsPublicRoute } from './utils/helpers'
import { getSearchParams } from './utils/helpers/getSearchParams'

import type { Database } from '@/@types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const currentRoute = '/' + req.nextUrl.pathname.split('/')[1]
  const isPublicRoute = checkIsPublicRoute(currentRoute)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.private.home, req.url))
  }

  if (!user && !isPublicRoute) {
    console.log(req.url)

    const isConfirmEmailCallback = req.url.includes('/auth/callback?')

    if (isConfirmEmailCallback) {
      const code = getSearchParams(req.url, 'code')

      if (code)
        return NextResponse.redirect(
          new URL(`${ROUTES.server.auth}/confirm-email?token=${code}`, req.url)
        )
    }

    console.log({ isPublicRoute })
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
