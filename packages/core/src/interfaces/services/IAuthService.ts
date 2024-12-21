import type { ApiResponse } from '../../responses/ApiResponse'

export interface IAuthService {
  fetchUserId(): Promise<ApiResponse<string>>
  signIn(email: string, password: string): Promise<ApiResponse<string>>
  signUp(email: string, password: string, name: string): Promise<ApiResponse<string>>
  signOut(): Promise<ApiResponse<boolean>>
  requestPasswordReset(email: string): Promise<ApiResponse<boolean>>
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void>
  confirmEmail(token: string): Promise<ApiResponse<boolean>>
  confirmPasswordReset(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>>
}
