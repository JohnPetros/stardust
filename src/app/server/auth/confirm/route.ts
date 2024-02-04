import { NextRequest, NextResponse } from 'next/server'

import { AuthConfirmationError } from '@/@types/authConfirmationError'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { COOKIES, ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

type Action = 'signup_confirmation' | 'email_change' | 'password_reset'

export async function GET(request: NextRequest) {
  const { url } = request
  const token = getSearchParams(url, 'token')
  const action = getSearchParams(url, 'action') as Action

  function redirectToSignIn(error: AuthConfirmationError) {
    return NextResponse.redirect(
      new URL(ROUTES.public.signIn + `?error=${error}`, url)
    )
  }

  if (!token) {
    return redirectToSignIn('token_error')
  }

  const supabase = createSupabaseServerClient()
  const authController = AuthController(supabase)

  switch (action) {
    case 'signup_confirmation': {
      try {
        const isConfirmed = await authController.confirmEmail(token)
        if (isConfirmed)
          return NextResponse.redirect(
            new URL(ROUTES.private.authConfirmation, url)
          )
      } catch (error) {
        return redirectToSignIn('signup_confirmation_error')
      }

      break
    }
    case 'password_reset': {
      try {
        await authController.confirmPasswordReset(token)

        const redirect = NextResponse.redirect(
          new URL(ROUTES.public.resetPassword, url),
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
        return redirectToSignIn('password_reset_error')
      }
    }
    default:
      return NextResponse.redirect(new URL(ROUTES.public.signIn, url))
  }

  return NextResponse.redirect(new URL(ROUTES.public.signIn, url))
}
