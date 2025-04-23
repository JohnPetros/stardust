import type { IAuthService } from '../../global/interfaces'
import type { RestResponse } from '../../global/responses'

export class AuthServiceMock implements IAuthService {
  signIn(email: string, password: string): Promise<RestResponse<{ userId: string }>> {
    throw new Error('Method not implemented.')
  }
  signUp(email: string, password: string): Promise<RestResponse<{ userId: string }>> {
    throw new Error('Method not implemented.')
  }
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  fetchUserId(): Promise<RestResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signOut(): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  requestPasswordReset(email: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  confirmEmail(token: string): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }
  confirmPasswordReset(
    token: string,
  ): Promise<RestResponse<{ accessToken: string; refreshToken: string }>> {
    throw new Error('Method not implemented.')
  }
}
