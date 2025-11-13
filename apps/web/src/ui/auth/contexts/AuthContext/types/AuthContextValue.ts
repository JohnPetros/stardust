import type { Account } from '@stardust/core/auth/entities'
import type { User } from '@stardust/core/global/entities'
import type { UserDto } from '@stardust/core/profile/entities/dtos'

export type AuthContextValue = {
  account: Account | null
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAccountAuthenticated: boolean
  handleSignIn(email: string, password: string): Promise<boolean>
  handleSignOut(): Promise<void>
  handleSignUpWithSocialAccount(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ isNewAccount: boolean }>
  updateUser(newUser: User): Promise<void>
  updateUserCache(userData: UserDto | null, shouldRevalidate?: boolean): void
  refetchUser(): void
  notifyUserChanges(): void
}
