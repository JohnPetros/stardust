import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AuthService } from '@/services/api/authService'
import { ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

export async function GET(request: NextRequest) {
  const token = getSearchParams(request.url, 'token')

  if (!token)
    return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))

  try {
    if (token) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const authService = AuthService(supabase)
      const user = await authService.confirmEmail(token)

      console.log({ user })
    }

    return NextResponse.redirect(
      new URL(ROUTES.private.emailConfirmation + '-callback', request.url)
    )
  } catch (error) {
    console.log({ error })
    return NextResponse.redirect(
      new URL(
        ROUTES.public.signIn + '?error=email_confirmation_error',
        request.url
      )
    )
  }
}
