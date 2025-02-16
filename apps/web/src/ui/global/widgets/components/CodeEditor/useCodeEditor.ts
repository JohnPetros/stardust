'use client'

import { useCallback, useRef } from 'react'
import type { Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { Backup } from '@stardust/core/global/structs'

import { COLORS } from '@/constants'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import { CODE_EDITOR_THEMES } from './code-editor-themes'
import type { CodeEditorTheme, CursorPosition } from './types'

export function useCodeEditor(
  initialValue: string,
  theme: CodeEditorTheme,
  onChange?: (value: string) => void,
) {
  const codeRunner = useCodeRunner()
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const codeBackup = useRef<Backup<string>>(Backup.create([initialValue]))

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
    const position = monacoEditorRef.current?.getPosition()

    if (!position) return null

    return {
      lineNumber: position.lineNumber,
      columnNumber: position.column,
    }
  }, [])

  const setCursorPosition = useCallback((cursorPostion: CursorPosition) => {
    return monacoEditorRef.current?.setPosition({
      lineNumber: cursorPostion.lineNumber,
      column: cursorPostion.columnNumber,
    })
  }, [])

  const getSelectedLinesRange = useCallback(() => {
    const selection = monacoEditorRef.current?.getSelection()

    if (selection) {
      return {
        start: selection.startLineNumber,
        end: selection.endLineNumber,
      }
    }

    return null
  }, [])

  const getValue = useCallback(() => {
    return monacoEditorRef.current?.getValue() ?? ''
  }, [])

  const setValue = useCallback((value: string) => {
    monacoEditorRef.current?.setValue(value)
  }, [])

  const reloadValue = useCallback(() => {
    codeBackup.current = Backup.create([initialValue])
    monacoEditorRef.current?.setValue(initialValue)
  }, [initialValue])

  const undoValue = useCallback(() => {
    if (codeBackup.current.isEmpty) return

    codeBackup.current = codeBackup.current.undo()
    monacoEditorRef.current?.setValue(codeBackup.current.lastState)
  }, [])

  function handleChange(value: string | undefined) {
    if (onChange && value) {
      onChange(value)
      codeBackup.current = codeBackup.current?.save(value)
    }
  }

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    monacoEditorRef.current = editor

    const monacoTokensProvider = codeRunner.getMonacoTokensProvider()
    const monacoLanguageConfiguration = codeRunner.getMonacoLanguageConfiguration()

    monaco.languages.register({ id: codeRunner.language })
    monaco.languages.setMonarchTokensProvider(codeRunner.language, monacoTokensProvider)
    monaco.languages.setLanguageConfiguration(
      codeRunner.language,
      monacoLanguageConfiguration,
    )

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

  return {
    language: codeRunner.language,
    getValue,
    setValue,
    reloadValue,
    undoValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    handleChange,
    handleEditorDidMount,
  }
}
