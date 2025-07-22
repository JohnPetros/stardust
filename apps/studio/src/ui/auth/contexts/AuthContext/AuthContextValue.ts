import type { Account } from '@stardust/core/auth/entities'
import type { Email } from '@stardust/core/global/structures'
import type { Password } from '@stardust/core/auth/structures'

export type AuthContextValue = {
  account: Account | null
  isLoading: boolean
  signIn(email: Email, password: Password): Promise<void>
  signOut(): Promise<void>
}
