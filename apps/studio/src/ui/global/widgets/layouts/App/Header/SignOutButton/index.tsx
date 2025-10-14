import { useSignOutButton } from './useSignOutButton'
import { useRest } from '@/ui/global/hooks/useRest'
import { useNavigationProvider } from '@/ui/global/hooks/useRouter'
import { SignOutButtonView } from './SignOutButtonView'
import { SESSION_STORAGE_KEYS } from '@/constants'
import { useSessionStorage } from 'usehooks-ts'

export const SignOutButton = () => {
  const { authService } = useRest()
  const navigationProvider = useNavigationProvider()
  const [_, setAccessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')
  const { handleClick } = useSignOutButton({
    authService,
    navigationProvider,
    onSignOut: () => setAccessToken(''),
  })

  return <SignOutButtonView onClick={handleClick} />
}
