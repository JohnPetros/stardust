'use client'

import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import Editor, { useMonaco, Monaco } from '@monaco-editor/react'

import { getDeleguaLanguageTokens } from '@/utils/functions/getDeleguaLanguageTokens'

import type monaco from 'monaco-editor'

export interface CodeEditorRef {
  reloadValue: () => void
}
interface CodeSnippetProps {
  value: string
  width: number | string
  height: number | string
  hasMinimap?: boolean
  isReadOnly: boolean
}

export function CodeEditorComponent(
  {
    value,
    width,
    height,
    hasMinimap = false,
    isReadOnly = false,
  }: CodeSnippetProps,
  ref: ForwardedRef<CodeEditorRef>
) {
  const monaco = useMonaco()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  console.log(isReadonly)

  const messageContribution = editorRef.current?.getContribution(
    'editor.contrib.messageController'
  )

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

    monaco.editor.defineTheme('delegua-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          token: 'keyword',
          foreground: '#0FE983',
        },
        {
          token: 'comment',
          foreground: '#999999',
        },
        {
          token: 'string',
          foreground: '#F1FA8C',
        },
        {
          token: 'operator',
          foreground: '#022F43',
        },
        {
          token: 'number',
          foreground: '#00D1FF',
        },
        {
          token: 'boolean',
          foreground: '#00D1FF',
        },
        {
          token: 'typeKeyword',
          foreground: '#0ac899',
        },
      ],
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
    monaco?.editor.defineTheme('delegua-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          token: 'keyword',
          foreground: '#50FA7B',
        },
        {
          token: 'comment',
          foreground: '#999999',
        },
        {
          token: 'string',
          foreground: '#F1FA8C',
        },
        // {
        //   token: 'operator',
        //   foreground: '#022F43',
        // },
        // {
        //   token: 'number',
        //   foreground: '#00D1FF',
        // },
      ],
      colors: {
        'editor.background': '#1E2626',
      },
    })
  }, [])

  return (
    <Editor
      width={width}
      height={height}
      language="delegua"
      theme="delegua-theme"
      options={{
        minimap: {
          enabled: hasMinimap,
        },
        fontSize: 18,
        fontFamily: 'Menlo',
        cursorStyle: 'block',
        wordWrap: 'on',
        autoIndent: 'full',
        readOnly: isReadOnly,
        domReadOnly: isReadOnly,
      }}
      value={value}
      onMount={handleEditorDidMount}
    />
  )
}

export const CodeEditor = forwardRef(CodeEditorComponent)
