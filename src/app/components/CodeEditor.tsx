'use client'

import { useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { getDeleguaLanguageTokens } from '@/utils/functions/getDeleguaLanguageTokens'

interface CodeSnippetProps {
  code: string
  width: number | string
  height: number | string
  hasMinimap?: boolean
}

export function CodeEditor({
  code,
  width,
  height,
  hasMinimap = false,
}: CodeSnippetProps) {
  const monaco = useMonaco()

  function handleEditorDidMount(_: any, monaco: any) {
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
      options={{
        minimap: {
          enabled: hasMinimap,
        },
        fontSize: 18,
        fontFamily: 'Menlo',
        cursorStyle: 'block',
        wordWrap: 'on',
        autoIndent: 'full',
      }}
      value={code}
      onMount={handleEditorDidMount}
    />
  )
}
