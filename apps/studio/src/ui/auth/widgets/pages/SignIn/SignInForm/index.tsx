import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { SignInFormView } from './SignInFormView'
import { useRest } from '@/ui/global/hooks/useRest'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

export const SignInForm = () => {
  const toastProvider = useToastProvider()
  const navigationProvider = useNavigationProvider()
  const { authService } = useRest()
  return (
    <SignInFormView
      toastProvider={toastProvider}
      authService={authService}
      navigationProvider={navigationProvider}
    />
  )
}
