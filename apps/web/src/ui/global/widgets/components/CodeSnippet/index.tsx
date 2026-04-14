'use client'

import { useRef } from 'react'

import { useCodeSnippet } from './useCodeSnippet'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { CodeSnippetView } from './CodeSnippetView'
import { useLsp } from '@/ui/global/hooks/useLsp'
import { useEditorContext } from '@/ui/global/hooks/useEditorContext'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  onChange?: (code: string) => void
}

export const CodeSnippet = ({ code, isRunnable = false, onChange }: CodeSnippetProps) => {
  const codeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const { lspProvider } = useLsp()
  const { getEditorConfig } = useEditorContext()
  const {
    editorHeight,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
    handleRunCode,
  } = useCodeSnippet({
    codeEditorRef,
    code,
    isRunnable,
    lspProvider,
    onEditorConfig: getEditorConfig,
  })

  if (!editorHeight) return null

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
