'use client'

import { useEffect, useRef } from 'react'
import { Monaco, useMonaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { THEMES } from '@/utils/constants'
import { getDeleguaLanguageTokens } from '@/utils/helpers/getDeleguaLanguageTokens'

export function useCodeEditor() {
  const monaco = useMonaco()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function getEditorRules() {
    const tokens = Object.keys(THEMES.darkSpace).slice(0, -2)
    const colors = Object.values(THEMES.darkSpace).slice(0, -2)

    return colors.map((color, index) => ({
      token: tokens[index].slice(0, -1),
      foreground: color,
    }))
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
  }, [monaco?.editor])

  return {
    editorRef,
    handleEditorDidMount,
  }
}
