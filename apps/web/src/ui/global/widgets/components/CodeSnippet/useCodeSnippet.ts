import { type RefObject, useMemo } from 'react'

import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { useClipboard } from '@/ui/global/hooks/useClipboard'

type UseCodeSnippetProps = {
  code: string
  isRunnable?: boolean
  codeEditorRef: RefObject<PlaygroundCodeEditorRef | null>
}

export function useCodeSnippet({ codeEditorRef, code, isRunnable }: UseCodeSnippetProps) {
  const { copy } = useClipboard()

  async function handleRunCode() {
    codeEditorRef.current?.runCode()
  }

  function handleReloadCodeButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  async function handleCopyCodeButtonClick() {
    const codeValue = codeEditorRef.current?.getValue()
    if (codeValue) await copy(codeValue, 'Código copiado!')
  }

  const editorHeight = useMemo(() => {
    if (!code) return 0
    const lines = code.split('\n').length

    if (isRunnable) return 100 + lines * (lines >= 10 ? 20 : 32)

    return lines * (lines >= 10 ? 24 : 32)
  }, [code, isRunnable])

  return {
    codeEditorRef,
    editorHeight,
    handleRunCode,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
  }
}
