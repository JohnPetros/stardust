'use client'

import { useRef } from 'react'

import { useCodeSnippet } from './useCodeSnippet'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { CodeSnippetView } from './CodeSnippetView'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  onChange?: (code: string) => void
}

export const CodeSnippet = ({ code, isRunnable = false, onChange }: CodeSnippetProps) => {
  const codeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const {
    editorHeight,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
    handleRunCode,
  } = useCodeSnippet({
    codeEditorRef,
    code,
    isRunnable,
  })

  if (editorHeight)
    return (
      <CodeSnippetView
        code={code}
        isRunnable={isRunnable}
        editorHeight={editorHeight}
        codeEditorRef={codeEditorRef}
        onReloadCodeButtonClick={handleReloadCodeButtonClick}
        onCopyCodeButtonClick={handleCopyCodeButtonClick}
        onRunCode={handleRunCode}
        onChange={onChange}
      />
    )
}
