import type { User } from '@/@core/domain/entities'
import type { UserDTO } from '@/@core/dtos'

import type { Session } from './Session'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  serverSession: Session | null
  handleSignIn(email: string, password: string): Promise<boolean>
  handleSignUp(email: string, password: string, name: string): Promise<boolean>
  handleSignOut(): Promise<void>
  updateUser(newUser: User): Promise<void>
  mutateUserCache(userData: UserDTO | null): void
}
