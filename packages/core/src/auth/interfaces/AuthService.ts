import type { RestResponse } from '@/global/responses'

export interface AuthService {
  fetchUserId(): Promise<RestResponse<string>>
  signIn(email: string, password: string): Promise<RestResponse<{ userId: string }>>
  signUp(email: string, password: string): Promise<RestResponse<{ userId: string }>>
  signOut(): Promise<RestResponse>
  requestPasswordReset(email: string): Promise<RestResponse>
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<RestResponse>
  confirmEmail(token: string): Promise<RestResponse>
  confirmPasswordReset(
    token: string,
  ): Promise<RestResponse<{ accessToken: string; refreshToken: string }>>
}
