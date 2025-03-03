import { useAction } from 'next-safe-action/hooks'
import { authActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useSignUpAction(onSuccess: (userId: string) => void) {
  const toast = useToastContext()
  const { executeAsync } = useAction(authActions.signUp, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
    },
    onSuccess: ({ data }) => {
      if (data?.userId) onSuccess(data?.userId)
    },
  })

  async function signUp(email: string, password: string, name: string) {
    await executeAsync({ email, name, password })
  }

  return {
    signUp,
  }
}
