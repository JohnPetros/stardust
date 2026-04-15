import { useMemo } from 'react'

type UseCodeExplanationDialogProps = {
  code: string
}

export function useCodeExplanationDialog({ code }: UseCodeExplanationDialogProps) {
  const codePanelHeight = useMemo(() => {
    if (!code) return 240

    const lines = code.split('\n').length
    return Math.max(240, lines * (lines >= 10 ? 24 : 32))
  }, [code])

  return {
    codePanelHeight,
  }
}
