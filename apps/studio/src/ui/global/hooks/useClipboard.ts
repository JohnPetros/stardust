import { useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

import { useToast } from './useToastProvider'

export function useClipboard() {
  const [_, copyToClipboard] = useCopyToClipboard()
  const toast = useToast()

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
