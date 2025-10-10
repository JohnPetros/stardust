import { useCallback, useRef } from 'react'
import type { Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { Backup } from '@stardust/core/global/structures'
import { DeleguaConfiguracaoParaEditorMonaco } from '@stardust/lsp'
import type { LspProvider } from '@stardust/core/global/interfaces'
import type { LspResponse } from '@stardust/core/global/responses'
import type { LspDocumentation, LspSnippet } from '@stardust/core/global/types'

import { COLORS } from '@/constants'
import { CODE_EDITOR_THEMES } from './code-editor-themes'
import type { CodeEditorTheme, CursorPosition } from './types'
import { LANGUAGE } from './language'

type Params = {
  initialValue: string
  theme: CodeEditorTheme
  isCodeCheckerEnabled: boolean
  lspProvider: LspProvider
  lspDocumentations: LspDocumentation[]
  lspSnippets: LspSnippet[]
  onChange?: (value: string) => void
}

export function useCodeEditor({
  initialValue,
  theme,
  isCodeCheckerEnabled,
  lspProvider,
  lspDocumentations,
  lspSnippets,
  onChange,
}: Params) {
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
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

  function handleSyntaxAnalysisErrors(response: LspResponse) {
    const editorModel = monacoEditorRef.current?.getModel()
    if (!editorModel) return

    monacoRef.current?.editor.setModelMarkers(editorModel, 'delegua', [])

    if (!response.isFailure) return

    const monacoErrors = response.errors.map((error) => ({
      startLineNumber: error.line,
      endLineNumber: 2,
      startColumn: 1,
      endColumn: 1000,
      message: error.message,
      severity: 8, // 8 is the severity for errors
    }))

    monacoRef.current?.editor.setModelMarkers(editorModel, LANGUAGE, monacoErrors)
  }

  function handleChange(value: string | undefined) {
    if (!value) return

    if (onChange) {
      onChange(value)
      codeBackup.current = codeBackup.current?.save(value)
    }

    if (!isCodeCheckerEnabled) return

    setTimeout(() => {
      const syntaxAnalysisResponse = lspProvider.performSyntaxAnalysis(value)
      handleSyntaxAnalysisErrors(syntaxAnalysisResponse)
    }, 100)
  }

  function provideCompletionItems() {
    const suggestions = lspSnippets.map((snippet) => ({
      label: snippet.label,
      kind: 17, // Monaco keyword,
      insertText: snippet.code,
      insertTextRules: 4,
    }))
    return {
      suggestions,
    }
  }

  function provideHover(model: monaco.editor.ITextModel, position: monaco.Position) {
    const wordAtPosition = model.getWordAtPosition(position)
    const documentation = lspDocumentations.find(
      (documentation) => documentation.word === wordAtPosition?.word,
    )
    if (documentation) {
      return {
        contents: [
          { value: `**${documentation.word}**` },
          { value: documentation.content },
          { value: `    ${documentation.example}    ` },
        ],
      }
    }
    return { contents: [] }
  }

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    monacoEditorRef.current = editor

    const monacoEditorConfiguration = new DeleguaConfiguracaoParaEditorMonaco()
    const monacoTokensProvider = monacoEditorConfiguration.obterDefinicaoDeLinguagem()
    const monacoLanguageConfiguration =
      monacoEditorConfiguration.obterConfiguracaoDeLinguagem()

    monaco.languages.register({ id: LANGUAGE })
    monaco.languages.setMonarchTokensProvider(LANGUAGE, monacoTokensProvider)
    monaco.languages.setLanguageConfiguration(LANGUAGE, monacoLanguageConfiguration)
    monaco.languages.registerHoverProvider(LANGUAGE, { provideHover })
    // @ts-ignore
    monaco.languages.registerCompletionItemProvider(LANGUAGE, { provideCompletionItems })

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
    monacoRef.current = monaco
  }

  return {
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
