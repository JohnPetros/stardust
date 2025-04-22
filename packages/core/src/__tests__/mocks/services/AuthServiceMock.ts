import type { IAuthService } from '../../../global/interfaces'
import type { ApiResponse } from '../../../global/responses'

export class AuthServiceMock implements IAuthService {
  signIn(email: string, password: string): Promise<ApiResponse<{ userId: string }>> {
    throw new Error('Method not implemented.')
  }
  signUp(email: string, password: string): Promise<ApiResponse<{ userId: string }>> {
    throw new Error('Method not implemented.')
  }
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }
  fetchUserId(): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signOut(): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }
  requestPasswordReset(email: string): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }
  confirmEmail(token: string): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }
  confirmPasswordReset(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    throw new Error('Method not implemented.')
  }
}
