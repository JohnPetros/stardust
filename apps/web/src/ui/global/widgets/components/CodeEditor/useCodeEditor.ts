'use client'

import { useCallback, useEffect, useRef } from 'react'
import { type Monaco, useMonaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { COLORS } from '@/constants'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import { CODE_EDITOR_THEMES } from './code-editor-themes'
import type { CodeEditorTheme, CursorPosition } from './types'

export function useCodeEditor(value: string, theme: CodeEditorTheme) {
  const monaco = useMonaco()
  const codeRunner = useCodeRunner()

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const getEditorRules = useCallback(() => {
    const tokens = Object.keys(CODE_EDITOR_THEMES.darkSpace).slice(0, -2)
    const colors = Object.values(CODE_EDITOR_THEMES.darkSpace).slice(0, -2)

    const rules = colors.map((color, index) => ({
      token: tokens[index] ? tokens[index].slice(0, -1) : '',
      foreground: color,
    }))

    return rules
  }, [])

  const getCursorPosition = useCallback(() => {
    const position = editorRef.current?.getPosition()

    if (!position) return null

    return {
      lineNumber: position.lineNumber,
      columnNumber: position.column,
    }
  }, [])

  const setCursorPosition = useCallback((cursorPostion: CursorPosition) => {
    return editorRef.current?.setPosition({
      lineNumber: cursorPostion.lineNumber,
      column: cursorPostion.columnNumber,
    })
  }, [])

  const getSelectedLinesRange = useCallback(() => {
    const selection = editorRef.current?.getSelection()

    if (selection) {
      return {
        start: selection.startLineNumber,
        end: selection.endLineNumber,
      }
    }

    return null
  }, [])

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

    monaco.editor.defineTheme('dark-space', {
      base: 'vs-dark',
      inherit: true,
      rules,
      colors: {
        'editor.background': COLORS.gray[800],
      },
    })

    monaco.editor.setTheme(theme)
  }

  // useEffect(() => {
  //   const rules = getEditorRules()

  //   monaco?.editor.defineTheme('editor-theme', {
  //     base: 'vs-dark',
  //     inherit: true,
  //     rules,
  //     colors: {
  //       'editor.background': COLORS.gray[800],
  //     },
  //   })
  // }, [monaco?.editor, getEditorRules])

  return {
    editorRef,
    getValue,
    setValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    handleEditorDidMount,
  }
}
