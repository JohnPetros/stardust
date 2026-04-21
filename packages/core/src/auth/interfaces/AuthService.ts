import type { Email, Name, Text } from '#global/domain/structures/index'
import type { Id } from '#global/domain/structures/Id'
import type { RestResponse } from '#global/responses/RestResponse'
import type { Password } from '../domain/structures'
import type { AccountDto } from '../domain/entities/dtos'
import type { SessionDto } from '../domain/structures/dtos'
import type { Account } from '../domain/entities'
import { ListResponse } from '#global/responses/ListResponse'

export type ApiKeyData = {
  id: string
  name: string
  keyPreview: string
  createdAt: Date
}

export interface AuthService {
  fetchAccount(): Promise<RestResponse<AccountDto>>
  fetchSocialAccount(): Promise<RestResponse<AccountDto>>
  signIn(email: Email, password: Password): Promise<RestResponse<SessionDto>>
  signInGodAccount(email: Email, password: Password): Promise<RestResponse<SessionDto>>
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
  disconnectGithubAccount(): Promise<RestResponse>
  confirmPasswordReset(token: Text): Promise<RestResponse<SessionDto>>
  refreshSession(refreshToken: Text): Promise<RestResponse<SessionDto>>
  connectGithubAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
  connectGoogleAccount(returnUrl: Text): Promise<RestResponse<{ signInUrl: string }>>
  disconnectGoogleAccount(): Promise<RestResponse>
  fetchGithubAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>>
  fetchGoogleAccountConnection(): Promise<RestResponse<{ isConnected: boolean }>>
  listApiKeys(): Promise<RestResponse<ListResponse<ApiKeyData>>>
  createApiKey(name: Name): Promise<RestResponse<ApiKeyData & { key: string }>>
  renameApiKey(apiKeyId: Id, name: Name): Promise<RestResponse<ApiKeyData>>
  revokeApiKey(apiKeyId: Id): Promise<RestResponse>
}
