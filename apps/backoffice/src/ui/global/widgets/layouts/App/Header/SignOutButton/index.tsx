import { useSignOutButton } from './useSignOutButton'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { SignOutButtonView } from './SignOutButtonView'
import { SESSION_STORAGE_KEYS } from '@/constants'
import { useSessionStorage } from 'usehooks-ts'

export const SignOutButton = () => {
  const { authService } = useRestContext()
  const navigationProvider = useNavigationProvider()
  const [, setAccessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')
  const [, setRefreshToken] = useSessionStorage(SESSION_STORAGE_KEYS.refreshToken, '')
  const { handleClick } = useSignOutButton({
    authService,
    navigationProvider,
    onSignOut: () => {
      setAccessToken('')
      setRefreshToken('')
    },
  })

  return <SignOutButtonView onClick={handleClick} />
}
