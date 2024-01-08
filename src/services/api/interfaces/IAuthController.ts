import { AuthError, Session } from '@supabase/supabase-js'

type SignInResponse =
  | {
      session: null
      error: string
    }
  | {
      session: Session
      error: null
    }

type SignUpResponse =
  | {
      userId: null
      error: AuthError
    }
  | {
      userId: string
      error: null
    }
  | null

export interface IAuthController {
  signIn(email: string, password: string): Promise<SignInResponse>
  signUp(email: string, password: string): Promise<SignUpResponse>
  signOut(): Promise<void>
  resetPassword(newPassword: string): Promise<void>
  githubOAuth(): Promise<void>
  getUserId(): Promise<string | null>
  confirmEmail(token: string): Promise<boolean>
  confirmPasswordReset(token: string): Promise<boolean>
}
