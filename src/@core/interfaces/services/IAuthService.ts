import { ServiceResponse } from '@/@core/responses'

export interface IAuthService {
  getUserId(): Promise<ServiceResponse<string>>
  signIn(email: string, password: string): Promise<ServiceResponse<string>>
  signUp(email: string, password: string, name: string): Promise<ServiceResponse<string>>
  signOut(): Promise<ServiceResponse<boolean>>
  requestPasswordReset(email: string): Promise<ServiceResponse<boolean>>
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string
  ): Promise<void>
  confirmEmail(token: string): Promise<ServiceResponse<boolean>>
  confirmPasswordReset(
    token: string
  ): Promise<ServiceResponse<{ accessToken: string; refreshToken: string }>>
}
