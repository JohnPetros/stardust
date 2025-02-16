import type { ApiResponse } from '#responses'

export interface IAuthService {
  fetchUserId(): Promise<ApiResponse<string>>
  signIn(email: string, password: string): Promise<ApiResponse<{ userId: string }>>
  signUp(email: string, password: string): Promise<ApiResponse<{ userId: string }>>
  signOut(): Promise<ApiResponse>
  requestPasswordReset(email: string): Promise<ApiResponse>
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<ApiResponse>
  confirmEmail(token: string): Promise<ApiResponse>
  confirmPasswordReset(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>>
}
