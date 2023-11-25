'use client'

import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import MonacoEditor, { Monaco, useMonaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { Loading } from './Loading'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useEditor } from '@/hooks/useEditor'
import { THEMES } from '@/utils/constants'
import { getDeleguaLanguageTokens } from '@/utils/helpers/getDeleguaLanguageTokens'

export interface EditorRef {
  reloadValue: () => void
}
interface EditorProps {
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
  const monaco = useMonaco()
  const { state } = useEditor()
  const { md: isMobile } = useBreakpoint()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function getEditorRules() {
    const tokens = Object.keys(THEMES.darkSpace).slice(0, -2)
    const colors = Object.values(THEMES.darkSpace).slice(0, -2)

    return colors.map((color, index) => ({
      token: tokens[index].slice(0, -1),
      foreground: color,
    }))
  }

  function reloadValue() {
    editorRef.current?.setValue(value)
  }

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor

    const messageContribution = editor.getContribution(
      'editor.contrib.messageController'
    )
    editor.onDidAttemptReadOnlyEdit(() => {
      messageContribution?.dispose()
    })

    monaco.languages.register({ id: 'delegua' })

    monaco.languages.setMonarchTokensProvider(
      'delegua',
      getDeleguaLanguageTokens()
    )

    const rules = getEditorRules()

    monaco.editor.defineTheme('delegua-theme', {
      base: 'vs-dark',
      inherit: true,
      rules,
      colors: {
        'editor.background': '#1E2626',
      },
    })

    monaco.editor.setTheme('delegua-theme')
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        reloadValue,
      }
    },
    []
  )

  useEffect(() => {
    const rules = getEditorRules()

    monaco?.editor.defineTheme('delegua-theme', {
      base: 'vs-dark',
      inherit: true,
      rules,
      colors: {
        'editor.background': '#1E2626',
      },
    })
  }, [])

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
        tabSize: state.tabSize - (isMobile ? 2 : 0),
        fontSize: state.fontSize - (isMobile ? 2 : 0),
        fontFamily: 'Menlo',
        cursorStyle: 'line',
        wordWrap: 'on',
        autoIndent: 'full',
        readOnly: isReadOnly,
        domReadOnly: isReadOnly,
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
