import type { IAuthService } from '@stardust/core/interfaces'
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  SignUpExceededRequestsError,
} from '@stardust/core/auth/errors'
import { Slug } from '@stardust/core/global/structs'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

import { getAppBaseUrl } from '@/utils'
import { ROUTES } from '@/constants'
import type { Supabase } from '../types'
import { SupabaseAuthError, SupabasePostgrestError } from '../errors'

export const SupabaseAuthService = (supabase: Supabase): IAuthService => {
  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return SupabaseAuthError(error, 'E-mail ou senha incorretos')

      return new ApiResponse({ body: data.session.user.id })
    },

    async signUp(email: string, password: string, name: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppBaseUrl()}/${ROUTES.server.auth.confirmEmail}`,
        },
      })

      if (error)
        switch (error?.name) {
          case 'email_exists':
            return new ApiResponse({
              errorMessage: 'E-mail já em uso',
              statusCode: HTTP_STATUS_CODE.conflict,
            })
          case 'over_request_rate_limit':
            return new ApiResponse({
              errorMessage: 'E-mail já em uso',
              statusCode: HTTP_STATUS_CODE.tooManyRequests,
            })
          default:
            return SupabaseAuthError(error, 'Error inesperado ao fazer cadastrar conta')
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
          return SupabasePostgrestError(
            insertUserError,
            'Error inesperado ao cadastrar usuário',
          )
      }

      return new ApiResponse({
        body: String(userId),
        statusCode: HTTP_STATUS_CODE.created,
      })
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error)
        return SupabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

      return new ApiResponse({ body: true })
    },

    async requestPasswordReset(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppBaseUrl()}${ROUTES.server.auth.confirmPasswordReset}`,
      })

      if (error)
        return SupabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

      return new ApiResponse()
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
        data: { user, session },
        error,
      } = await supabase.auth.verifyOtp({
        type: 'email',
        token_hash: token,
      })

      if (session) {
        await supabase.auth.refreshSession({ refresh_token: session?.refresh_token })
      }

      if (error) return SupabaseAuthError(error, 'Error inesperado ao confirmar e-mail')

      return new ApiResponse()
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
        return SupabaseAuthError(otpError, 'Error inesperado ao confirmar e-mail')
      }

      if (!session) {
        return new ApiResponse<{ accessToken: string; refreshToken: string }>({
          errorMessage: 'Sessão não encontrada',
          statusCode: HTTP_STATUS_CODE.unauthorized,
        })
      }

      return new ApiResponse({
        body: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        },
      })
    },

    async fetchUserId() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      const errorMessage = 'Usuário não encontrado'

      if (error) return SupabaseAuthError(error, errorMessage)
      if (!user)
        return new ApiResponse({
          errorMessage,
          statusCode: HTTP_STATUS_CODE.unauthorized,
        })

      return new ApiResponse({ body: user.id })
    },
  }
}
