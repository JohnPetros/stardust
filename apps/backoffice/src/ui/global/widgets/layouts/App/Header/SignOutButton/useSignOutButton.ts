import { ROUTES } from '@/constants'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { NavigationProvider } from '@stardust/core/global/interfaces'

type Params = {
  authService: AuthService
  navigationProvider: NavigationProvider
  onSignOut: () => void
}

export function useSignOutButton({ authService, navigationProvider, onSignOut }: Params) {
  async function handleClick() {
    await authService.signOut()
    onSignOut()
    navigationProvider.goTo(ROUTES.index)
  }

  return {
    handleClick,
  }
}
