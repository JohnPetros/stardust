import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from 'supabase/supabase-server'

import { AuthService } from '@/services/api/authService'
import { ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

type AuthType = 'email' | 'email-change'

export async function GET(request: NextRequest) {
  const token = getSearchParams(request.url, 'token')
  const authType = getSearchParams(request.url, 'type') as AuthType

  if (!token)
    return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))

  try {
    const supabase = createServerClient()
    const authService = AuthService(supabase)

    switch (authType) {
      case 'email':
        if (authType === 'email') {
          const user = await authService.confirmEmail(token)
          console.log({ user })
          if (user) {
            return NextResponse.redirect(
              new URL(ROUTES.private.authConfirmation, request.url)
            )
          }
        }

        break
      default:
        return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))
    }
  } catch (error) {
    console.log({ error })
    return NextResponse.redirect(
      new URL(
        ROUTES.public.signIn + '?error=email_confirmation_error',
        request.url
      )
    )
  }

  return NextResponse.redirect(new URL(ROUTES.public.signIn, request.url))
}
