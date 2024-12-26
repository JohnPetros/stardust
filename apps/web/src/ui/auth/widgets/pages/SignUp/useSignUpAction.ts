import { useAction } from 'next-safe-action/hooks'
import { authActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useSignUpAction(onSuccess: VoidFunction) {
  const toast = useToastContext()
  const { executeAsync } = useAction(authActions.signUp, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
    },
    onSuccess,
  })

  async function signUp(email: string, name: string, password: string) {
    await executeAsync({ email, name, password })

    return true
  }

  return {
    signUp,
  }
}
