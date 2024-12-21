import type { IAuthService } from '../#interfaces'
import type { ApiResponse } from '../../../responses'

export class AuthServiceMock implements IAuthService {
  fetchUserId(): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signIn(email: string, password: string): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signUp(email: string, password: string, name: string): Promise<ApiResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signOut(): Promise<ApiResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }
  confirmEmail(token: string): Promise<ApiResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  confirmPasswordReset(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    throw new Error('Method not implemented.')
  }
}
