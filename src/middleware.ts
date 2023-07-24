import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsPublicRoute } from './utils/functions'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const isPublicRoute = checkIsPublicRoute(req.nextUrl.pathname)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return res
}

export const config = { matcher: '/((?!.*\\.).*)' }
