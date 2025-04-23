import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { ENV, ROUTES } from '@/constants'
import type { Supabase } from '../types'
import { SupabaseAuthError } from '../errors'

export const SupabaseAuthService = (supabase: Supabase): AuthService => {
  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return SupabaseAuthError(error, 'E-mail ou senha incorretos')

      return new RestResponse({ body: { userId: data.session.user.id } })
    },

    async signUp(email: string, password: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${ENV.appHost}/${ROUTES.api.auth.confirmEmail}`,
        },
      })

      if (error)
        switch (error?.code) {
          case 'weak_password':
            return new RestResponse({
              errorMessage: 'Senha de conter pelo menos 6 caracteres',
              statusCode: HTTP_STATUS_CODE.conflict,
            })
          case 'email_exists':
            return new RestResponse({
              errorMessage: 'E-mail já em uso',
              statusCode: HTTP_STATUS_CODE.conflict,
            })
          case 'over_request_rate_limit':
            return new RestResponse({
              errorMessage: 'E-mail já em uso',
              statusCode: HTTP_STATUS_CODE.tooManyRequests,
            })
          default:
            return SupabaseAuthError(error, 'Error inesperado ao fazer cadastrar conta')
        }

      const userId = data.user?.id

      return new RestResponse({
        body: { userId: String(userId) },
        statusCode: HTTP_STATUS_CODE.created,
      })
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error)
        return SupabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

      return new RestResponse({ body: true })
    },

    async requestPasswordReset(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${ENV.appHost}${ROUTES.api.auth.confirmPasswordReset}`,
      })

      if (error)
        return SupabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

      return new RestResponse()
    },

    async resetPassword(newPassword: string, accessToken: string, refreshToken: string) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        return SupabaseAuthError(sessionError, 'Erro inesperado ao redefinir a senha')
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) return SupabaseAuthError(error, 'Erro inesperado ao redefinir a senha')

      return new RestResponse()
    },

    async confirmEmail(token: string) {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        type: 'email',
        token_hash: token,
      })

      if (session) {
        await supabase.auth.refreshSession({ refresh_token: session?.refresh_token })
      }

      if (error) return SupabaseAuthError(error, 'Error inesperado ao confirmar email')

      return new RestResponse()
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
        return SupabaseAuthError(otpError, 'Link de email inválido ou expirado')
      }

      if (!session) {
        return new RestResponse<{ accessToken: string; refreshToken: string }>({
          errorMessage: 'Sessão não encontrada',
          statusCode: HTTP_STATUS_CODE.unauthorized,
        })
      }

      return new RestResponse({
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
        return new RestResponse({
          errorMessage,
          statusCode: HTTP_STATUS_CODE.unauthorized,
        })

      return new RestResponse({ body: user.id })
    },
  }
}
