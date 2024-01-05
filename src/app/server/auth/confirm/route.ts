import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from 'supabase/supabase-server'

import { AuthConfirmationError } from '@/@types/authConfirmationError'
import { AuthController } from '@/services/api/authController'
import { COOKIES, ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

type AuthType = 'email' | 'email-change' | 'password-reset'

export async function GET(request: NextRequest) {
  const token = getSearchParams(request.url, 'token')
  const authType = getSearchParams(request.url, 'type') as AuthType
  const baseUrl = request.url

  if (!token)
    return NextResponse.redirect(new URL(ROUTES.public.signIn, baseUrl))

  function redirectToSignIn(error: AuthConfirmationError) {
    NextResponse.redirect(
      new URL(ROUTES.public.signIn + `?error=${error}`, baseUrl)
    )
  }

  const supabase = createServerClient()
  const authController = AuthController(supabase)

  switch (authType) {
    case 'email': {
      try {
        const isConfirmed = await authController.confirmEmail(token)
        if (isConfirmed)
          return NextResponse.redirect(
            new URL(ROUTES.private.authConfirmation, baseUrl)
          )
      } catch (error) {
        redirectToSignIn('email_confirmation_error')
      }

      break
    }
    case 'password-reset': {
      const isConfirmed = await authController.confirmPasswordReset(token)

      if (isConfirmed) {
        try {
          const redirect = NextResponse.redirect(
            new URL(ROUTES.public.resetPassword, baseUrl),
            { status: 302 }
          )

          redirect.cookies.set(COOKIES.shouldReturnPassword, 'true', {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 15, // 15 minutes
          })

          return redirect
        } catch (error) {
          console.log({ error })
          redirectToSignIn('password_reset_error')
        }
      }

      break
    }
    default:
      return NextResponse.redirect(new URL(ROUTES.public.signIn, baseUrl))
  }

  return NextResponse.redirect(new URL(ROUTES.public.signIn, baseUrl))
}
