'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import type { CodeEditorRef, CodeEditorTheme } from './types'
import { useCodeEditor } from './useCodeEditor'
import { CodeEditorView } from './CodeEditorView'
import { useLsp } from '@/ui/global/hooks/useLsp'

type CodeEditorProps = {
  value: string
  theme?: CodeEditorTheme
  width: number | string
  height: number | string
  isReadOnly?: boolean
  onChange?: (value: string) => void
}

export const Widget = (
  {
    value,
    width,
    height,
    theme = 'dark-space',
    isReadOnly = false,
    onChange = () => {},
  }: CodeEditorProps,
  ref: ForwardedRef<CodeEditorRef>,
) => {
  const { lspProvider, documentations, snippets } = useLsp()
  const {
    getValue,
    setValue,
    undoValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    handleChange,
    handleEditorDidMount,
  } = useCodeEditor({
    initialValue: value,
    theme,
    isCodeCheckerEnabled: true,
    lspProvider,
    lspDocumentations: documentations,
    lspSnippets: snippets,
    onChange,
  })

  useImperativeHandle(ref, () => {
    return {
      getValue,
      setValue,
      undoValue,
      reloadValue,
      getCursorPosition,
      setCursorPosition,
      getSelectedLinesRange,
    }
  }, [
    getValue,
    setValue,
    undoValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
  ])

  return (
    <CodeEditorView
      value={value}
      width={width}
      height={height}
      theme={theme}
      isReadOnly={isReadOnly}
      isMobile={true}
      tabSize={2}
      fontSize={18}
      onChange={handleChange}
      onMount={handleEditorDidMount}
    />
  )
}

export const CodeEditor = forwardRef(Widget)
