import { useState } from 'react'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToast } from '@/contexts/ToastContext'

export function useSignOutAlert() {
  const { signOut } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  function showErrorMessage() {
    toast.show('Erro ao tentar sair da conta', {
      type: 'error',
      seconds: 4,
    })
    setIsLoading(false)
  }

  async function handleSignOut() {
    setIsLoading(true)

    try {
      await signOut()
    } catch (error) {
      if (error) {
        console.error(error)
        showErrorMessage()
      }
    }

    setTimeout(() => {
      showErrorMessage()
    }, 10000)
  }

  return {
    isLoading,
    handleSignOut,
  }
}
