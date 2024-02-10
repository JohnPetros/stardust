import type { OAuthProvider } from './OAuthProvider'
import type { Session } from './Session'
import type { SignUpResponse } from './SignUpResponse'

import type { User } from '@/@types/User'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string): Promise<SignUpResponse>
  signOut(): Promise<void>
  signInWithOAuth(provider: OAuthProvider): Promise<void>
  updateUser(newUserData: Partial<User>): Promise<void>
  mutateUserCache(newUserData: Partial<User>): void
  serverSession: Session | null
}
