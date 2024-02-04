'use client'

import { useCallback, useState } from 'react'

export function useClipboard(text: string) {

  const copy = useCallback(async () => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error) {
      console.warn('Copy failed', error)
    }
  }, [text])

  return { copy }
}
