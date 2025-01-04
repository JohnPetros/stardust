'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import MonacoEditor from '@monaco-editor/react'

import { useBreakpoint } from '@/ui/global/hooks'
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
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    handleEditorDidMount,
  } = useCodeEditor(value, theme)

  const { md: isMobile } = useBreakpoint()

  useImperativeHandle(
    ref,
    () => {
      return {
        getValue,
        setValue,
        reloadValue,
        getCursorPosition,
        setCursorPosition,
        getSelectedLinesRange,
      }
    },
    [
      getValue,
      setValue,
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
      onChange={(value) => onChange(String(value))}
    />
  )
}

export const CodeEditor = forwardRef(CodeEditorComponent)
