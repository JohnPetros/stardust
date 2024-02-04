'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import MonacoEditor from '@monaco-editor/react'

import { Loading } from '../Loading'

import { useEditor } from './useEditor'

import { useEditorContext } from '@/contexts/EditorContext/hooks/useEditorContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'

export type CursorPosition = {
  lineNumber: number
  columnNumber: number
}

export type SelectedLinesRange = {
  start: number
  end: number
}

export type EditorRef = {
  getValue: () => string
  setValue: (value: string) => void
  reloadValue: () => void
  getCursorPosition: () => CursorPosition | null
  setCursorPosition: (cursorPositon: CursorPosition) => void
  getSelectedLinesRange: () => SelectedLinesRange | null
}

type EditorProps = {
  value: string
  width: number | string
  height: number | string
  hasMinimap?: boolean
  isReadOnly?: boolean
  onChange?: (value: string) => void
}

export function EditorComponent(
  {
    value,
    width,
    height,
    hasMinimap = false,
    isReadOnly = false,
    onChange = () => {},
  }: EditorProps,
  ref: ForwardedRef<EditorRef>
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
  } = useEditor(value)
  const { md: isMobile } = useBreakpoint()

  console.log(state.tabSize)

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
    ]
  )

  return (
    <MonacoEditor
      width={width}
      height={height}
      language="delegua"
      theme="delegua-theme"
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
        <div className="grid place-content-center">
          <Loading />
        </div>
      }
      value={value}
      onMount={handleEditorDidMount}
      onChange={(value) => onChange(String(value))}
    />
  )
}

export const Editor = forwardRef(EditorComponent)
