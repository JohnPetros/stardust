'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import type { CodePlaybackLineRangeDto } from '@stardust/core/global/structures/dtos'

import type { CodeEditorRef, CodeEditorTheme } from './types'
import { useCodeEditor } from './useCodeEditor'
import { CodeEditorView } from './CodeEditorView'
import { useLsp } from '@/ui/global/hooks/useLsp'
import { useEditorContext } from '@/ui/global/hooks/useEditorContext'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'

type CodeEditorProps = {
  value: string
  theme?: CodeEditorTheme
  width: number | string
  height: number | string
  isReadOnly?: boolean
  isCodeCheckerDisabled?: boolean
  highlightedLineRanges?: CodePlaybackLineRangeDto[]
  onChange?: (value: string) => void
}

export const Widget = (
  {
    value,
    width,
    height,
    theme = 'dark-space',
    isReadOnly = false,
    isCodeCheckerDisabled = true,
    highlightedLineRanges,
    onChange = () => {},
  }: CodeEditorProps,
  ref: ForwardedRef<CodeEditorRef>,
) => {
  const {
    state: { fontSize, tabSize, isCodeCheckerEnabled },
  } = useEditorContext()
  const { md: isMobile } = useBreakpoint()
  const { lspProvider, documentations } = useLsp()
  const {
    getValue,
    setValue,
    undoValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getSelectedText,
    handleChange,
    handleEditorDidMount,
  } = useCodeEditor({
    initialValue: value,
    theme,
    isCodeCheckerEnabled: isCodeCheckerDisabled ? false : isCodeCheckerEnabled,
    lspProvider,
    lspDocumentations: documentations,
    highlightedLineRanges,
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
      getSelectedText,
    }
  }, [
    getValue,
    setValue,
    undoValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getSelectedText,
  ])

  return (
    <CodeEditorView
      value={value}
      width={width}
      height={height}
      theme={theme}
      isReadOnly={isReadOnly}
      isMobile={isMobile}
      tabSize={tabSize}
      fontSize={fontSize}
      onChange={handleChange}
      onMount={handleEditorDidMount}
    />
  )
}

export const CodeEditor = forwardRef(Widget)
