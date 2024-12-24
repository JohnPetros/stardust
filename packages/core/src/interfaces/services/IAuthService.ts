import type { ApiResponse } from '../../responses/ApiResponse'

export interface IAuthService {
  fetchUserId(): Promise<ApiResponse<string>>
  signIn(email: string, password: string): Promise<ApiResponse<string>>
  signUp(email: string, password: string, name: string): Promise<ApiResponse<string>>
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
