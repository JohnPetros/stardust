import type { User } from '@stardust/core/global/entities'
import type { UserDto } from '@stardust/core/global/dtos'
import type { Session } from './Session'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  serverSession: Session | null
  handleSignIn(email: string, password: string): Promise<boolean>
  handleSignUp(email: string, password: string, name: string): Promise<boolean>
  handleSignOut(): Promise<void>
  updateUser(newUser: User): Promise<void>
  mutateUserCache(userData: UserDto | null): void
}
