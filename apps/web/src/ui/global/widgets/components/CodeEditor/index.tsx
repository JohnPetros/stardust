'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import type { CodeEditorRef, CodeEditorTheme } from './types'
import { useCodeEditor } from './useCodeEditor'
import { CodeEditorView } from './CodeEditorView'

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
  } = useCodeEditor(value, theme, onChange)

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
      onChange={handleChange}
      onMount={handleEditorDidMount}
    />
  )
}

export const CodeEditor = forwardRef(Widget)
