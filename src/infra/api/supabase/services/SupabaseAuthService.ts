import { IAuthService } from '@/@core/interfaces/services'
import {
  ConfirmEmailFailedError,
  ConfirmPasswordResetFailedError,
  EmailAlreadyExistsError,
  SignOutFailedError,
  SignUpFailedError,
  SignUpRateLimitError,
} from '@/@core/errors/auth'
import { SaveUserFailedError, UserNotFoundError } from '@/@core/errors/users'
import { Slug } from '@/@core/domain/structs/Slug'
import { ServiceResponse } from '@/@core/responses'

import { ROUTES } from '@/modules/global/constants'
import { getAppBaseUrl } from '@/modules/global/utils'

import { Supabase } from '../types'
import { SupabaseAuthError } from '../errors/SupabaseAuthError'

import { SupabasePostgrestError } from '../errors'

export const SupabaseAuthService = (supabase: Supabase): IAuthService => {
  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return SupabaseAuthError(error, UserNotFoundError)

      return new ServiceResponse(data.session.user.id)
    },

    async signUp(email: string, password: string, name: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppBaseUrl()}/${
            ROUTES.server.auth.confirmEmail
          }&type=confirm-email`,
        },
      })

      if (error)
        switch (error?.name) {
          case 'email_exists':
            return SupabaseAuthError(error, EmailAlreadyExistsError)
          case 'over_request_rate_limit':
            return SupabaseAuthError(error, SignUpRateLimitError)
          default:
            return SupabaseAuthError(error, SignUpFailedError)
        }

      const userId = data.user?.id

      if (userId) {
        const { error: insertUserError } = await supabase.from('users').insert({
          id: userId,
          name,
          email,
          slug: Slug.create(name).value,
        })

        if (insertUserError)
          return SupabasePostgrestError(insertUserError, SaveUserFailedError)
      }

      return new ServiceResponse(String(userId))
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) return SupabaseAuthError(error, SignOutFailedError)

      return new ServiceResponse(true)
    },

    async requestPasswordReset(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppBaseUrl()}${ROUTES.server.auth.confirmPasswordReset}`,
      })

      if (error) return SupabaseAuthError(error, SignOutFailedError)

      return new ServiceResponse(true)
    },

    async resetPassword(newPassword: string, accessToken: string, refreshToken: string) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        throw new Error(sessionError?.message)
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw new Error(error.message)
      }
    },

    async confirmEmail(token: string) {
      const {
        data: { user },
        error,
      } = await supabase.auth.verifyOtp({
        type: 'email',
        token_hash: token,
      })

      if (error) return SupabaseAuthError(error, ConfirmEmailFailedError)

      return new ServiceResponse(!!user?.email)
    },

    async confirmPasswordReset(token: string) {
      const {
        data: { session },
        error: otpError,
      } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token_hash: token,
      })

      if (otpError) {
        return SupabaseAuthError(otpError, ConfirmPasswordResetFailedError)
      }

      if (!session) {
        return new ServiceResponse<{ accessToken: string; refreshToken: string }>(
          null,
          ConfirmPasswordResetFailedError
        )
      }

      return new ServiceResponse({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      })
    },

    async getUserId() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      return new ServiceResponse(user?.id ?? null)
    },
  }
}
