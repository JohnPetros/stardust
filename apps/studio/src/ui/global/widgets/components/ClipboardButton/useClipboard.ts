import { useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

export function useClipboard(text: string) {
  const [_, copyToClipboard] = useCopyToClipboard()

  const copy = useCallback(() => {
    copyToClipboard(text)
  }, [copyToClipboard, text])

  return {
    copy,
  }
}
