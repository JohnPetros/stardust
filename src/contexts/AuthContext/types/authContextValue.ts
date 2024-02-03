import { type AuthError, type Session } from '@supabase/supabase-js'

import type { OAuthProvider } from './oAuthProvider'

import type { User } from '@/@types/user'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn(email: string, password: string): Promise<void>
  signUp(
    email: string,
    password: string
  ): Promise<{
    userId: string | null
    error: AuthError | null
  } | null>
  signOut(): Promise<void>
  signInWithOAuth(provider: OAuthProvider): Promise<void>
  updateUser(newUserData: Partial<User>): Promise<void>
  mutateUserCache(newUserData: Partial<User>): void
  serverSession: Session | null
}
