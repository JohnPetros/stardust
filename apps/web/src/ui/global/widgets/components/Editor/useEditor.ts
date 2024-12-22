'use client'

import { useCallback, useEffect, useRef } from 'react'
import { type Monaco, useMonaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { COLORS, EDITOR_THEMES } from '@/constants'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'

export function useEditor(value: string) {
  const monaco = useMonaco()
  const codeRunner = useCodeRunner()

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const getEditorRules = useCallback(() => {
    const tokens = Object.keys(EDITOR_THEMES.code.darkSpace).slice(0, -2)
    const colors = Object.values(EDITOR_THEMES.code.darkSpace).slice(0, -2)

    const rules = colors.map((color, index) => ({
      token: tokens[index] ? tokens[index].slice(0, -1) : '',
      foreground: color,
    }))

    return rules
  }, [])

  function getCursorPosition() {
    const position = editorRef.current?.getPosition()

    if (!position) return null

    return {
      lineNumber: position.lineNumber,
      columnNumber: position.column,
    }
  }

  const getValue = useCallback(() => {
    return editorRef.current?.getValue() ?? ''
  }, [])

  const setValue = useCallback((value: string) => {
    editorRef.current?.setValue(value)
  }, [])

  const reloadValue = useCallback(() => {
    editorRef.current?.setValue(value)
  }, [value])

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    editorRef.current = editor

    monaco.languages.register({ id: codeRunner.id })

    const monacoEditorConfig = codeRunner.getMonacoEditorConfig()

    monaco.languages.setMonarchTokensProvider(codeRunner.id, monacoEditorConfig)

    const rules = getEditorRules()

    monaco.editor.defineTheme('editor-theme', {
      base: 'vs-dark',
      inherit: true,
      rules,
      colors: {
        'editor.background': COLORS.gray[800],
      },
    })

    monaco.editor.setTheme('editor-theme')
  }

  useEffect(() => {
    const rules = getEditorRules()

    monaco?.editor.defineTheme('editor-theme', {
      base: 'vs-dark',
      inherit: true,
      rules,
      colors: {
        'editor.background': COLORS.gray[800],
      },
    })
  }, [monaco?.editor, getEditorRules])

  return {
    editorRef,
    getValue,
    setValue,
    reloadValue,
    getCursorPosition,
    handleEditorDidMount,
  }
}
