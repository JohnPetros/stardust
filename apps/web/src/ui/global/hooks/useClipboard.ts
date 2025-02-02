'use client'

import { useCallback } from 'react'
import { useToastContext } from '../contexts/ToastContext'

export function useClipboard() {
  const toast = useToastContext()

  const copy = useCallback(
    async (text: string, successMessage: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported')
        return
      }

      try {
        await navigator.clipboard.writeText(text)
        toast.show(successMessage, { type: 'success' })
        return
      } catch (error) {
        console.warn('Copy failed', error)
      }
    },
    [toast.show],
  )

  return { copy }
}
