import type { IAuthService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'

export class AuthServiceMock implements IAuthService {
  fetchUserId(): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signIn(email: string, password: string): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signUp(email: string, password: string, name: string): Promise<ServiceResponse<string>> {
    throw new Error('Method not implemented.')
  }
  signOut(): Promise<ServiceResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  requestPasswordReset(email: string): Promise<ServiceResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  resetPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  confirmEmail(token: string): Promise<ServiceResponse<boolean>> {
    throw new Error('Method not implemented.')
  }
  confirmPasswordReset(token: string): Promise<ServiceResponse<{ accessToken: string; refreshToken: string }>> {
    throw new Error('Method not implemented.')
  }
 
}
