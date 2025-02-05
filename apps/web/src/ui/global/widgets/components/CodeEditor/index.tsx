'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import MonacoEditor from '@monaco-editor/react'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useEditorContext } from '@/ui/global/contexts/EditorContext/hooks'
import { Loading } from '../Loading'
import type { CodeEditorRef, CodeEditorTheme } from './types'
import { useCodeEditor } from './useCodeEditor'

type CodeEditorProps = {
  value: string
  theme?: CodeEditorTheme
  width: number | string
  height: number | string
  hasMinimap?: boolean
  isReadOnly?: boolean
  onChange?: (value: string) => void
}

export function CodeEditorComponent(
  {
    value,
    width,
    height,
    theme = 'dark-space',
    hasMinimap = false,
    isReadOnly = false,
    onChange = () => {},
  }: CodeEditorProps,
  ref: ForwardedRef<CodeEditorRef>,
) {
  const { state } = useEditorContext()
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

  const { md: isMobile } = useBreakpoint()

  useImperativeHandle(
    ref,
    () => {
      return {
        getValue,
        setValue,
        undoValue,
        reloadValue,
        getCursorPosition,
        setCursorPosition,
        getSelectedLinesRange,
      }
    },
    [
      getValue,
      setValue,
      undoValue,
      reloadValue,
      getCursorPosition,
      setCursorPosition,
      getSelectedLinesRange,
    ],
  )

  return (
    <MonacoEditor
      width={width}
      height={height}
      language='delegua'
      theme={theme}
      options={{
        minimap: {
          enabled: hasMinimap,
        },
        tabSize: state.tabSize,
        fontSize: state.fontSize - (isMobile ? 2 : 0),
        fontFamily: 'Menlo',
        cursorStyle: 'line',
        wordWrap: 'on',
        autoIndent: 'full',
        readOnly: isReadOnly,
        domReadOnly: true,
      }}
      loading={
        <div className='grid place-content-center'>
          <Loading />
        </div>
      }
      value={value}
      onMount={handleEditorDidMount}
      onChange={handleChange}
    />
  )
}

export const  CodeEditor = forwardRef(CodeEditorComponent)
