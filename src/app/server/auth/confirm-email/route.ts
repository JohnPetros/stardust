import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AuthService } from '@/services/api/authService'
import { ROUTES } from '@/utils/constants'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token = requestUrl.searchParams.get('token')

  if (!token)
    return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))

  try {
    if (token) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const authService = AuthService(supabase)
      const user = await authService.confirmEmail(token)

      console.log(user)
    }
  } catch (error) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))
  }

  return NextResponse.redirect(
    new URL(ROUTES.private.emailConfirmation + '/555', request.url)
  )
}
