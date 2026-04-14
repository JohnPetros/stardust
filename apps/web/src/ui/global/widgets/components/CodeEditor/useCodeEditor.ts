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

let deleguaCompletionProvider: monaco.IDisposable | null = null

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
      // Verifica se há uma seleção real (não apenas cursor em uma linha)
      const hasRealSelection =
        selection.startLineNumber !== selection.endLineNumber ||
        selection.startColumn !== selection.endColumn

      if (!hasRealSelection) {
        return null
      }

      return {
        start: selection.startLineNumber,
        end: selection.endLineNumber,
      }
    }

    return null
  }, [])

  const getSelectedText = useCallback(() => {
    const selection = monacoEditorRef.current?.getSelection()
    const model = monacoEditorRef.current?.getModel()

    if (!selection || !model) {
      return null
    }

    // Verifica se há uma seleção real (não apenas cursor em uma linha)
    const hasRealSelection =
      selection.startLineNumber !== selection.endLineNumber ||
      selection.startColumn !== selection.endColumn

    if (!hasRealSelection) {
      return null
    }

    // Retorna o texto exatamente como foi selecionado
    return model.getValueInRange(selection)
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

  async function handleChange(value: string | undefined) {
    if (!value) return

    if (onChange) {
      onChange(value)
      codeBackup.current = codeBackup.current?.save(value)
    }

    if (!isCodeCheckerEnabled) return

    setTimeout(async () => {
      const syntaxAnalysisResponse = await lspProvider.performSyntaxAnalysis(value)
      handleSyntaxAnalysisErrors(syntaxAnalysisResponse)
    }, 100)
  }

  function extractLocalFunctionNames(code: string) {
    const functionNames = new Set<string>()

    const functionDeclarationRegex = /\b(?:funcao|função)\s+([a-zA-ZÀ-ú_][\wÀ-ú]*)\s*\(/g
    const assignedFunctionRegex =
      /\b(?:var|variavel|variável|const|constante|fixo)\s+([a-zA-ZÀ-ú_][\wÀ-ú]*)\s*=\s*(?:funcao|função)\s*\(/g

    let match: RegExpExecArray | null

    while ((match = functionDeclarationRegex.exec(code)) !== null) {
      if (match[1]) {
        functionNames.add(match[1])
      }
    }

    while ((match = assignedFunctionRegex.exec(code)) !== null) {
      if (match[1]) {
        functionNames.add(match[1])
      }
    }

    return [...functionNames]
  }

  function extractLocalBindingNames(code: string) {
    const variableNames = new Set<string>()
    const constantNames = new Set<string>()

    const variableDeclarationRegex =
      /\b(?:var|variavel|variável)\s+([a-zA-ZÀ-ú_][\wÀ-ú]*)/g
    const constantDeclarationRegex =
      /\b(?:const|constante|fixo)\s+([a-zA-ZÀ-ú_][\wÀ-ú]*)/g

    let match: RegExpExecArray | null

    while ((match = variableDeclarationRegex.exec(code)) !== null) {
      if (match[1]) {
        variableNames.add(match[1])
      }
    }

    while ((match = constantDeclarationRegex.exec(code)) !== null) {
      if (match[1]) {
        constantNames.add(match[1])
      }
    }

    return {
      variableNames: [...variableNames],
      constantNames: [...constantNames],
    }
  }

  function provideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
  ) {
    const snippetsSuggestions = lspSnippets.map((snippet) => ({
      label: snippet.label,
      kind: monacoRef.current?.languages.CompletionItemKind.Keyword ?? 17,
      insertText: snippet.code,
      insertTextRules: 4,
    }))

    const wordUntilPosition = model.getWordUntilPosition(position)
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: wordUntilPosition.startColumn,
      endColumn: wordUntilPosition.endColumn,
    }
    const currentWord = wordUntilPosition.word.toLowerCase()

    const localFunctionSuggestions = extractLocalFunctionNames(model.getValue())
      .filter((functionName) => {
        if (!currentWord) return true

        return functionName.toLowerCase().startsWith(currentWord)
      })
      .map((functionName) => ({
        label: functionName,
        kind: monacoRef.current?.languages.CompletionItemKind.Function ?? 1,
        insertText: functionName,
        range,
        detail: 'Função local',
      }))

    const { variableNames, constantNames } = extractLocalBindingNames(model.getValue())

    const localVariableSuggestions = variableNames
      .filter((variableName) => {
        if (!currentWord) return true

        return variableName.toLowerCase().startsWith(currentWord)
      })
      .map((variableName) => ({
        label: variableName,
        kind: monacoRef.current?.languages.CompletionItemKind.Variable ?? 6,
        insertText: variableName,
        range,
        detail: 'Variável local',
      }))

    const localConstantSuggestions = constantNames
      .filter((constantName) => {
        if (!currentWord) return true

        return constantName.toLowerCase().startsWith(currentWord)
      })
      .map((constantName) => ({
        label: constantName,
        kind: monacoRef.current?.languages.CompletionItemKind.Constant ?? 21,
        insertText: constantName,
        range,
        detail: 'Constante local',
      }))

    const uniqueSuggestions = [
      ...localFunctionSuggestions,
      ...localVariableSuggestions,
      ...localConstantSuggestions,
      ...snippetsSuggestions,
    ].filter((suggestion, index, suggestions) => {
      return (
        suggestions.findIndex((current) => {
          return (
            current.label === suggestion.label &&
            current.insertText === suggestion.insertText
          )
        }) === index
      )
    })

    return {
      suggestions: uniqueSuggestions,
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
    if (!deleguaCompletionProvider) {
      deleguaCompletionProvider = monaco.languages.registerCompletionItemProvider(
        LANGUAGE,
        { provideCompletionItems },
      )
    }

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

  function updateEditorOptions(tabSize: number, fontSize: number) {
    monacoEditorRef.current?.updateOptions({
      tabSize,
      fontSize,
      detectIndentation: false,
      insertSpaces: true,
    })

    monacoEditorRef.current?.getModel()?.updateOptions({
      tabSize,
      indentSize: tabSize,
      insertSpaces: true,
      trimAutoWhitespace: true,
    })
  }

  return {
    getValue,
    setValue,
    reloadValue,
    undoValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getSelectedText,
    handleChange,
    handleEditorDidMount,
    updateEditorOptions,
  }
}
