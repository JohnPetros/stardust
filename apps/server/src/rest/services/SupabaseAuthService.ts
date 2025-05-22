import type { AuthError } from '@supabase/supabase-js'

import type { Supabase } from '@/database/supabase/types'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'

export class SupabaseAuthService implements AuthService {
  constructor(private readonly supabase: Supabase) {}

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error)
      return this.supabaseAuthError<{ userId: string }>(
        error,
        'E-mail ou senha incorretos',
      )

    return new RestResponse({ body: { userId: data.session.user.id } })
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    })

    if (error)
      switch (error?.code) {
        case 'weak_password':
          return new RestResponse<{ userId: string }>({
            errorMessage: 'Senha de conter pelo menos 6 caracteres',
            statusCode: HTTP_STATUS_CODE.conflict,
          })
        case 'email_exists':
          return new RestResponse<{ userId: string }>({
            errorMessage: 'E-mail já em uso',
            statusCode: HTTP_STATUS_CODE.conflict,
          })
        case 'over_request_rate_limit':
          return new RestResponse<{ userId: string }>({
            errorMessage: 'E-mail já em uso',
            statusCode: HTTP_STATUS_CODE.tooManyRequests,
          })
        default:
          return this.supabaseAuthError<{ userId: string }>(
            error,
            'Error inesperado ao fazer cadastrar conta',
          )
      }

    const userId = data.user?.id

    return new RestResponse({
      body: { userId: String(userId) },
      statusCode: HTTP_STATUS_CODE.created,
    })
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

    return new RestResponse({ body: true })
  }

  async requestPasswordReset(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email)

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

    return new RestResponse()
  }

  async resetPassword(newPassword: string, accessToken: string, refreshToken: string) {
    const { error: sessionError } = await this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError) {
      return this.supabaseAuthError(sessionError, 'Erro inesperado ao redefinir a senha')
    }

    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao redefinir a senha')

    return new RestResponse()
  }

  async confirmEmail(token: string) {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.verifyOtp({
      type: 'email',
      token_hash: token,
    })

    if (session) {
      await this.supabase.auth.refreshSession({ refresh_token: session?.refresh_token })
    }

    if (error) return this.supabaseAuthError(error, 'Error inesperado ao confirmar email')

    return new RestResponse()
  }

  async confirmPasswordReset(token: string) {
    const {
      data: { session },
      error: otpError,
    } = await this.supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash: token,
    })

    if (otpError) {
      return this.supabaseAuthError<{ accessToken: string; refreshToken: string }>(
        otpError,
        'Link de email inválido ou expirado',
      )
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
  }

  async fetchUserId() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()

    const errorMessage = 'Usuário não encontrado'

    if (error) return this.supabaseAuthError<string>(error, errorMessage)

    if (!user)
      return new RestResponse<string>({
        errorMessage,
        statusCode: HTTP_STATUS_CODE.unauthorized,
      })

    return new RestResponse({ body: user.id })
  }

  private supabaseAuthError<Data>(error: AuthError, errorMessage: string) {
    return new RestResponse<Data>({
      errorMessage,
      statusCode: error.status,
    })
  }
}
