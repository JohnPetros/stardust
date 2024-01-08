import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { AuthConfirmationError } from '@/@types/authConfirmationError'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { COOKIES, ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

type AuthType = 'email' | 'email-change' | 'password-reset'

export async function GET(request: NextRequest) {
  const baseUrl = request.url
  const authToken = getSearchParams(baseUrl, 'auth_token')
  const authType = getSearchParams(baseUrl, 'type') as AuthType

  if (!authToken)
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
        const isConfirmed = await authController.confirmEmail(authToken)
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
      const passwordToken = getSearchParams(baseUrl, 'password_token')
      const passwordTokenSecret = process.env.PASSWORD_TOKEN_SECRET

      if (passwordToken && passwordTokenSecret) {
        try {
          jwt.verify(passwordToken, passwordTokenSecret)

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
      } else {
        redirectToSignIn('password_reset_error')
      }

      break
    }
    default:
      return NextResponse.redirect(new URL(ROUTES.public.signIn, baseUrl))
  }

  return NextResponse.redirect(new URL(ROUTES.public.signIn, baseUrl))
}
