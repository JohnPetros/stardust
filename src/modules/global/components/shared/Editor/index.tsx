'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import MonacoEditor from '@monaco-editor/react'

import { Loading } from '../Loading'

import type { EditorRef } from './types'
import { useBreakpoint } from '@/modules/global/hooks'
import { useEditorContext } from '@/modules/app/contexts/EditorContext/hooks'
import { useEditor } from './useEditor'

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
  ref: ForwardedRef<EditorRef>,
) {
  const { state } = useEditorContext()
  const { getValue, setValue, reloadValue, handleEditorDidMount } = useEditor(value)

  const { md: isMobile } = useBreakpoint()

  useImperativeHandle(
    ref,
    () => {
      return {
        getValue,
        setValue,
        reloadValue,
      }
    },
    [getValue, setValue, reloadValue],
  )

  return (
    <MonacoEditor
      width={width}
      height={height}
      language='delegua'
      theme='delegua-theme'
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

export const Editor = forwardRef(EditorComponent)
