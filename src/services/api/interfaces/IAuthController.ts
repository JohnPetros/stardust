import type { Session } from '@/contexts/AuthContext/types/Session'
import type { SignUpResponse } from '@/contexts/AuthContext/types/SignUpResponse'

export interface IAuthController {
  signIn(email: string, password: string): Promise<Session>
  signUp(email: string, password: string): Promise<SignUpResponse>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(
    newPassword: string,
    accessToken: string,
    refreshToken: string
  ): Promise<void>
  signInWithGithubOAuth(): Promise<void>
  getUserId(): Promise<string | null>
  confirmEmail(token: string): Promise<boolean>
  confirmPasswordReset(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }>
}
