import { useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

import { useToastProvider } from './useToastProvider'

export function useClipboard() {
  const [_, copyToClipboard] = useCopyToClipboard()
  const toast = useToastProvider()

  const copy = useCallback(
    (text: string, successMessage?: string) => {
      copyToClipboard(text)
      toast.showSuccess(successMessage ?? 'Código copiado!')
    },
    [copyToClipboard, toast],
  )

  return {
    copy,
  }
}
