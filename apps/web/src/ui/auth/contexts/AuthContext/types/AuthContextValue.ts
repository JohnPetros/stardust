import type { User } from '@stardust/core/global/entities'
import type { Session } from './Session'
import type { UserDto } from '@stardust/core/profile/entities/dtos'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  serverSession: Session | null
  handleSignIn(email: string, password: string): Promise<boolean>
  handleSignOut(): Promise<void>
  updateUser(newUser: User): Promise<void>
  updateUserCache(userData: UserDto | null, shouldRevalidate?: boolean): void
  refetchUser(): void
  notifyUserChanges(): void
}
