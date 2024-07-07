import { User } from '@/@core/domain/entities'

import type { Session } from './Session'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  serverSession: Session | null
  handleSignIn(email: string, password: string): Promise<boolean>
  handleSignUp(email: string, password: string, name: string): Promise<void>
  handleSignOut(): Promise<void>
  updateUser(newUserData: Partial<User>): Promise<void>
  mutateUserCache(newUserData: User): void
}
