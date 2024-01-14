import { useMemo, useRef } from 'react'

import { CodeEditorPlaygroundRef } from '../CodeEditorPlayground'

import { CodeSnippetProps } from '.'

export function useCodeSnippet({ code, isRunnable }: CodeSnippetProps) {
  const codeEditorRef = useRef<CodeEditorPlaygroundRef | null>(null)

  async function handleRunCode() {
    codeEditorRef.current?.runUserCode()
  }

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  const editorHeight = useMemo(() => {
    const lines = code.split('\n').length

    if (isRunnable) return 100 + lines * (lines >= 10 ? 20 : 32)
    else return 100 + lines
  }, [code, isRunnable])

  return {
    codeEditorRef,
    editorHeight,
    handleRunCode,
    handleReloadButtonClick,
  }
}
