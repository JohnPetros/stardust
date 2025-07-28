import { useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

import { useToast } from './useToast'

export function useClipboard() {
  const [_, copyToClipboard] = useCopyToClipboard()
  const { showSuccess } = useToast()

  const copy = useCallback(
    (text: string) => {
      copyToClipboard(text)
      showSuccess('Copiado para a área de transferência')
    },
    [copyToClipboard, showSuccess],
  )

  return {
    copy,
  }
}
