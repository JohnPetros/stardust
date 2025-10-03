import type { AuthError, UserIdentity } from '@supabase/supabase-js'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import type { Email, Id, Text } from '@stardust/core/global/structures'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { Password } from '@stardust/core/auth/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import { ConflictError, MethodNotImplementedError } from '@stardust/core/global/errors'
import { NotFoundError } from '@stardust/core/global/errors'

import type { Supabase } from '@/database/supabase/types'
import { ENV } from '@/constants'

export class SupabaseAuthService implements AuthService {
  constructor(private readonly supabase: Supabase) {}

  private readonly AUTH_ERROR_CODES = {
    no_authorization: 'no_authorization',
    weekPassword: 'weak_password',
    emailExists: 'email_exists',
    overRequestRateLimit: 'over_request_rate_limit',
    otpExpired: 'otp_expired',
    default: 'default',
    bad_jwt: 'bad_jwt',
    session_expired: 'session_expired',
  }

  async signIn(email: Email, password: Password): Promise<RestResponse<SessionDto>> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error)
      return this.supabaseAuthError<SessionDto>(
        error,
        'E-mail ou senha incorretos',
        HTTP_STATUS_CODE.unauthorized,
      )

    const session: SessionDto = {
      account: {
        id: data.user.id,
        email: data.user.email ?? '',
        name: data.user.user_metadata.full_name ?? '',
        isAuthenticated: true,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      durationInSeconds: data.session.expires_in,
    }

    return new RestResponse({ body: session, statusCode: HTTP_STATUS_CODE.created })
  }

  async signUp(email: Email, password: Password): Promise<RestResponse<AccountDto>> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: ENV.stardustWebUrl,
      },
    })

    if (error)
      switch (error?.code) {
        case this.AUTH_ERROR_CODES.weekPassword:
          return new RestResponse<AccountDto>({
            errorMessage: 'Senha de conter pelo menos 6 caracteres',
            statusCode: HTTP_STATUS_CODE.conflict,
          })
        case this.AUTH_ERROR_CODES.emailExists:
          return new RestResponse<AccountDto>({
            errorMessage: 'E-mail já em uso',
            statusCode: HTTP_STATUS_CODE.conflict,
          })
        case this.AUTH_ERROR_CODES.overRequestRateLimit:
          return new RestResponse<AccountDto>({
            errorMessage: 'E-mail já em uso',
            statusCode: HTTP_STATUS_CODE.tooManyRequests,
          })
        default:
          return this.supabaseAuthError<AccountDto>(
            error,
            'Error inesperado ao fazer cadastrar conta',
          )
      }

    const account: AccountDto = {
      id: data?.user?.id ?? '',
      email: email.value,
      name: '',
      isAuthenticated: false,
    }

    return new RestResponse({
      body: account,
      statusCode: HTTP_STATUS_CODE.created,
    })
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao tentar sair da conta')

    return new RestResponse({ statusCode: HTTP_STATUS_CODE.noContent })
  }

  async signInWithGoogleAccount(
    returnUrl: Text,
  ): Promise<RestResponse<{ signInUrl: string }>> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: returnUrl.value,
      },
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao fazer login com Google')

    return new RestResponse({ body: { signInUrl: data.url } })
  }

  async signInWithGithubAccount(
    returnUrl: Text,
  ): Promise<RestResponse<{ signInUrl: string }>> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: returnUrl.value,
      },
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao fazer login com Github')

    return new RestResponse({ body: { signInUrl: data.url } })
  }

  async signUpWithSocialAccount(): Promise<RestResponse<{ isNewAccount: boolean }>> {
    throw new MethodNotImplementedError('signUpWithSocialAccount')
  }

  async connectGithubAccount(
    returnUrl: Text,
  ): Promise<RestResponse<{ signInUrl: string }>> {
    const { data, error } = await this.supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: returnUrl.value,
      },
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao conectar conta com Github')

    return new RestResponse({ body: { signInUrl: data.url } })
  }

  async connectGoogleAccount(
    returnUrl: Text,
  ): Promise<RestResponse<{ signInUrl: string }>> {
    const { data, error } = await this.supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: returnUrl.value,
      },
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao conectar conta com Google')

    return new RestResponse({ body: { signInUrl: data.url } })
  }

  private async getIdentities(
    provider: 'google' | 'github',
  ): Promise<RestResponse<{ identity: UserIdentity; count: number }>> {
    const { data, error } = await this.supabase.auth.getUserIdentities()

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao buscar identidades')

    const identity = data.identities.find((identity) => identity.provider === provider)

    if (!identity)
      return new RestResponse({
        errorMessage: 'Conta social não encontrada',
        statusCode: HTTP_STATUS_CODE.notFound,
      })

    return new RestResponse({ body: { identity, count: data.identities.length } })
  }

  async disconnectGoogleAccount(): Promise<RestResponse> {
    const response = await this.getIdentities('google')
    if (response.isFailure) response.throwError()

    const { identity, count } = response.body

    if (count === 1)
      throw new ConflictError(
        'Não é possível desconectar a única conta que você possui para acessar a plataforma',
      )

    const { error } = await this.supabase.auth.unlinkIdentity(identity)

    if (error)
      return this.supabaseAuthError(
        error,
        'Erro inesperado ao desconectar conta com Google',
      )

    return new RestResponse()
  }

  async disconnectGithubAccount(): Promise<RestResponse> {
    const response = await this.getIdentities('github')
    if (response.isFailure) response.throwError()

    const { identity, count } = response.body

    if (count === 1)
      throw new ConflictError(
        'Não é possível desconectar a única conta que você possui para acessar a plataforma',
      )

    const { error } = await this.supabase.auth.unlinkIdentity(identity)

    if (error)
      return this.supabaseAuthError(
        error,
        'Erro inesperado ao desconectar conta com Github',
      )

    return new RestResponse()
  }

  async fetchGithubAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>> {
    const response = await this.getIdentities('github')
    if (response.isFailure) return new RestResponse({ body: { isConnected: false } })

    return new RestResponse({ body: { isConnected: response.body.count > 0 } })
  }

  async fetchGoogleAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>> {
    const response = await this.getIdentities('google')
    if (response.isFailure) return new RestResponse({ body: { isConnected: false } })

    return new RestResponse({ body: { isConnected: response.body.count > 0 } })
  }

  async resendSignUpEmail(email: Email): Promise<RestResponse> {
    const { error } = await this.supabase.auth.resend({
      email: email.value,
      type: 'signup',
      options: {
        emailRedirectTo: ENV.stardustWebUrl,
      },
    })

    if (error)
      return this.supabaseAuthError(
        error,
        'Erro inesperado ao reenviar e-mail de cadastro',
      )

    return new RestResponse()
  }

  async requestSignUp(): Promise<RestResponse<SessionDto>> {
    throw new MethodNotImplementedError('requestSignUp')
  }

  async requestPasswordReset(email: Email) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: ENV.stardustWebUrl,
    })

    if (error)
      return this.supabaseAuthError(
        error,
        'Erro inesperado ao enviar e-mail de pedido de redefinição de senha',
      )

    return new RestResponse()
  }

  async resetPassword(newPassword: Text, accessToken: Text, refreshToken: Text) {
    const { error: sessionError } = await this.supabase.auth.setSession({
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
    })

    if (sessionError) {
      return this.supabaseAuthError(sessionError, 'Erro inesperado ao redefinir a senha')
    }

    const { error } = await this.supabase.auth.updateUser({
      password: newPassword.value,
    })

    if (error)
      return this.supabaseAuthError(error, 'Erro inesperado ao redefinir a senha')

    return new RestResponse()
  }

  async confirmEmail(token: Text): Promise<RestResponse<SessionDto>> {
    const { data, error } = await this.supabase.auth.verifyOtp({
      type: 'email',
      token_hash: token.value,
    })

    if (error) {
      switch (error?.code) {
        case this.AUTH_ERROR_CODES.otpExpired:
          return new RestResponse<SessionDto>({
            errorMessage: 'Link de confirmação de e-mail expirado',
            statusCode: HTTP_STATUS_CODE.unauthorized,
          })
        default:
          return this.supabaseAuthError(error, 'Error inesperado ao confirmar email')
      }
    }

    const session: SessionDto = {
      account: {
        id: data?.user?.id ?? '',
        email: data?.user?.email ?? '',
        name: data?.user?.user_metadata.full_name ?? '',
        isAuthenticated: true,
      },
      accessToken: data?.session?.access_token ?? '',
      refreshToken: data?.session?.refresh_token ?? '',
      durationInSeconds: data?.session?.expires_in ?? 0,
    }

    return new RestResponse({ body: session })
  }

  async confirmPasswordReset(token: Text) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash: token.value,
    })

    if (error) {
      switch (error.code) {
        case this.AUTH_ERROR_CODES.otpExpired:
          return new RestResponse<SessionDto>({
            errorMessage: 'Código de confirmação de redefinição de senha expirado',
            statusCode: HTTP_STATUS_CODE.unauthorized,
          })
        default:
          return this.supabaseAuthError<SessionDto>(
            error,
            'Error inesperado ao confirmar redefinição de senha',
          )
      }
    }

    const session: SessionDto = {
      account: {
        id: data?.user?.id ?? '',
        email: data?.user?.email ?? '',
        name: data?.user?.user_metadata.full_name ?? '',
        isAuthenticated: true,
      },
      accessToken: data?.session?.access_token ?? '',
      refreshToken: data?.session?.refresh_token ?? '',
      durationInSeconds: data?.session?.expires_in ?? 0,
    }

    return new RestResponse({
      body: session,
      statusCode: HTTP_STATUS_CODE.created,
    })
  }

  async refreshSession(refreshToken: Text): Promise<RestResponse<SessionDto>> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken.value,
    })

    if (error)
      return this.supabaseAuthError<SessionDto>(
        error,
        'Erro inesperado ao atualizar token de acesso',
      )

    const session: SessionDto = {
      account: {
        id: data?.user?.id ?? '',
        email: data?.user?.email ?? '',
        name: data?.user?.user_metadata.full_name ?? '',
        isAuthenticated: true,
      },
      accessToken: data?.session?.access_token ?? '',
      refreshToken: data?.session?.refresh_token ?? '',
      durationInSeconds: data?.session?.expires_in ?? 0,
    }

    return new RestResponse({ body: session, statusCode: HTTP_STATUS_CODE.created })
  }

  async fetchAccount(): Promise<RestResponse<AccountDto>> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()

    if (error) {
      switch (error.code) {
        case this.AUTH_ERROR_CODES.no_authorization:
          return new RestResponse<AccountDto>({
            errorMessage: 'Conta não autorizada',
            statusCode: HTTP_STATUS_CODE.unauthorized,
          })
        case this.AUTH_ERROR_CODES.bad_jwt:
          return new RestResponse<AccountDto>({
            errorMessage: 'Token de autenticação inválido',
            statusCode: HTTP_STATUS_CODE.unauthorized,
          })
        case this.AUTH_ERROR_CODES.session_expired:
          return new RestResponse<AccountDto>({
            errorMessage: 'Sessão expirada, faça login novamente',
            statusCode: HTTP_STATUS_CODE.unauthorized,
          })
        default:
          return this.supabaseAuthError<AccountDto>(
            error,
            'Error inesperado ao buscar conta',
          )
      }
    }

    const account: AccountDto = {
      id: user?.id ?? '',
      email: user?.email ?? '',
      name: user?.user_metadata.full_name ?? '',
      isAuthenticated: true,
    }

    return new RestResponse({
      body: account,
    })
  }

  async fetchSocialAccount(): Promise<RestResponse<AccountDto>> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()

    if (error) {
      return this.supabaseAuthError(error, 'Error inesperado ao buscar conta')
    }

    const account: AccountDto = {
      id: user?.id ?? '',
      email: user?.email ?? '',
      name: user?.user_metadata.full_name ?? '',
      isAuthenticated: true,
    }

    return new RestResponse({ body: account })
  }

  async deleteAccount(accountId: Id): Promise<RestResponse> {
    const { error } = await this.supabase.auth.admin.deleteUser(accountId.value)
    if (error) return this.supabaseAuthError(error, 'Error inesperado ao deletar conta')
    return new RestResponse()
  }

  private supabaseAuthError<Data>(
    error: AuthError,
    errorMessage: string,
    statusCode: number = HTTP_STATUS_CODE.serverError,
  ) {
    console.error('Supabase auth error message: ', error.message)
    return new RestResponse<Data>({
      errorMessage,
      statusCode,
    })
  }
}
