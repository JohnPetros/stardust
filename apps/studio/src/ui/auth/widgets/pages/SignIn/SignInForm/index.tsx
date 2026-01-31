import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { SignInFormView } from './SignInFormView'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

export const SignInForm = () => {
  const toastProvider = useToastProvider()
  const navigationProvider = useNavigationProvider()
  const { authService } = useRestContext()
  return (
    <SignInFormView
      toastProvider={toastProvider}
      authService={authService}
      navigationProvider={navigationProvider}
    />
  )
}
