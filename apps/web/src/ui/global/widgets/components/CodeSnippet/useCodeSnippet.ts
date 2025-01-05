import { useMemo, useRef } from 'react'

import type { CodeSnippetProps } from '.'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'

export function useCodeSnippet({ code, isRunnable }: CodeSnippetProps) {
  const codeEditorRef = useRef<PlaygroundCodeEditorRef | null>(null)

  async function handleRunCode() {
    codeEditorRef.current?.runCode()
  }

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
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
    handleReloadButtonClick,
  }
}
