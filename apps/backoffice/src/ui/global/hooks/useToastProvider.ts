import { useCallback } from 'react'
import { toast } from 'sonner'

import type { ToastProvider } from '@stardust/core/global/interfaces'

export function useToastProvider(): ToastProvider {
  const showSuccess = useCallback((message: string) => {
    toast.success(message)
  }, [])

  const showError = useCallback((message: string) => {
    toast.error(message)
  }, [])

  return {
    showSuccess,
    showError,
  }
}
