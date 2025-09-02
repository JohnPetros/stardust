import type { Email, Id, Name, Text } from '#global/domain/structures/index'
import type { RestResponse } from '#global/responses/RestResponse'
import type { Password } from '../domain/structures'
import type { AccountDto } from '../domain/entities/dtos'
import type { SessionDto } from '../domain/structures/dtos'
import type { Account } from '../domain/entities'

export interface AuthService {
  fetchAccount(): Promise<RestResponse<AccountDto>>
  fetchSocialAccount(): Promise<RestResponse<AccountDto>>
  signIn(email: Email, password: Password): Promise<RestResponse<SessionDto>>
  signUp(email: Email, password: Password): Promise<RestResponse<AccountDto>>
  signInWithGoogleAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
  signInWithGithubAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
  signUpWithSocialAccount(
    socialAccount: Account,
  ): Promise<RestResponse<{ isNewAccount: boolean }>>
  signOut(): Promise<RestResponse>
  resendSignUpEmail(email: Email): Promise<RestResponse>
  requestSignUp(email: Email, password: Password, name: Name): Promise<RestResponse>
  requestPasswordReset(email: Email): Promise<RestResponse>
  resetPassword(
    newPassword: Password,
    accessToken: Text,
    refreshToken: Text,
  ): Promise<RestResponse>
  confirmEmail(token: Text): Promise<RestResponse<SessionDto>>
  confirmPasswordReset(token: Text): Promise<RestResponse<SessionDto>>
  refreshSession(refreshToken: Text): Promise<RestResponse<SessionDto>>
  deleteAccount(accountId: Id): Promise<RestResponse>
  connectGithubAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
  connectGoogleAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
}
