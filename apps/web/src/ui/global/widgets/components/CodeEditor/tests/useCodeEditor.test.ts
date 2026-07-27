import { act, renderHook } from '@testing-library/react'
import type { Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'
import { type Mock, mock } from 'ts-jest-mocker'

import type { LspProvider } from '@stardust/core/global/interfaces'
import type { LspCompletion } from '@stardust/core/global/types'
import type { CodePlaybackLineRangeDto } from '@stardust/core/global/structures/dtos'
import { DeleguaProvedorLsp } from '@stardust/lsp'

import { useCodeEditor } from '../useCodeEditor'

let lspProvider: LspProvider

const snippetCode = 'retorna $' + '{1:valor}'
const dynamicFunctionSnippetCode =
  'calcular_total($' + '{1:valor_base}, $' + '{2:incremento_extra})'

type CompletionProvider = {
  provideCompletionItems: (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
  ) => monaco.languages.ProviderResult<monaco.languages.CompletionList>
}

type DisposableMock = monaco.IDisposable & {
  dispose: jest.Mock
}

function crieDisposable(): DisposableMock {
  return {
    dispose: jest.fn(),
  }
}

function crieMonacoMock(languages: monaco.languages.ILanguageExtensionPoint[] = []) {
  const disposables: DisposableMock[] = []
  let completionProvider: CompletionProvider | null = null
  const monacoMock = {
    languages: {
      CompletionItemKind: {
        Keyword: 17,
        Snippet: 27,
        Function: 1,
        Variable: 4,
        Value: 12,
      },
      CompletionItemInsertTextRule: {
        InsertAsSnippet: 4,
      },
      getLanguages: jest.fn(() => languages),
      register: jest.fn(),
      setMonarchTokensProvider: jest.fn(),
      setLanguageConfiguration: jest.fn(),
      registerHoverProvider: jest.fn(() => {
        const disposable = crieDisposable()
        disposables.push(disposable)
        return disposable
      }),
      registerCompletionItemProvider: jest.fn(
        (_language: string, provider: CompletionProvider) => {
          const disposable = crieDisposable()
          disposables.push(disposable)
          completionProvider = provider
          return disposable
        },
      ),
    },
    editor: {
      defineTheme: jest.fn(),
      setTheme: jest.fn(),
      setModelMarkers: jest.fn(),
    },
  } as unknown as Monaco

  return {
    monacoMock,
    disposables,
    get completionProvider() {
      return completionProvider
    },
  }
}

type TestHookProps = {
  highlightedLineRanges?: CodePlaybackLineRangeDto[]
}

function useTestCodeEditor({ highlightedLineRanges }: TestHookProps = {}) {
  return useCodeEditor({
    initialValue: '',
    theme: 'dark-space',
    isCodeCheckerEnabled: false,
    lspProvider,
    lspDocumentations: [],
    highlightedLineRanges,
    onChange: jest.fn(),
  })
}

function renderCodeEditorHook(highlightedLineRanges?: CodePlaybackLineRangeDto[]) {
  return renderHook(
    ({ highlightedLineRanges: ranges }: TestHookProps) =>
      useTestCodeEditor({ highlightedLineRanges: ranges }),
    { initialProps: { highlightedLineRanges } },
  )
}

function crieEditorMock(visibleRanges: monaco.Range[] = []) {
  let nextDecorationId = 0
  const model = {
    getLineCount: jest.fn(() => 20),
  }
  const deltaDecorations = jest.fn(
    (_oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[]) =>
      newDecorations.map(() => `decoration-${++nextDecorationId}`),
  )
  const editor = {
    getModel: jest.fn(() => model),
    deltaDecorations,
    getVisibleRanges: jest.fn(() => visibleRanges),
    revealLinesInCenterIfOutsideViewport: jest.fn(),
  } as unknown as monaco.editor.IStandaloneCodeEditor

  return { editor, model, deltaDecorations }
}

describe('useCodeEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.stardustCodeEditorMonacoProvidersRegistry = {
      owner: null,
      providers: [],
    }
    lspProvider = mock<LspProvider>()
  })

  it('should adapt LSP completions to Monaco completion items', () => {
    const completions: LspCompletion[] = [
      {
        label: 'retorna',
        code: snippetCode,
        kind: 'control-flow',
      },
      {
        label: 'precoFinal',
        code: 'precoFinal',
        kind: 'variable',
      },
    ]
    const lspProviderMock = lspProvider as Mock<LspProvider>
    lspProviderMock.getCompletions.mockReturnValue(completions)
    const { result } = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const editor = {} as monaco.editor.IStandaloneCodeEditor

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    const model = {
      getValue: jest.fn(() => 'variavel precoFinal = 10'),
      getWordUntilPosition: jest.fn(() => ({
        word: 'ret',
        startColumn: 1,
        endColumn: 4,
      })),
    } as unknown as monaco.editor.ITextModel
    const position = {
      lineNumber: 1,
      column: 4,
    } as monaco.Position

    const completionList = monaco.completionProvider?.provideCompletionItems(
      model,
      position,
    )

    if (!completionList || 'then' in completionList) {
      throw new Error('Completion list should be synchronous')
    }

    expect(lspProvider.getCompletions).toHaveBeenCalledWith('variavel precoFinal = 10')
    expect(completionList.suggestions).toEqual([
      expect.objectContaining({
        label: 'retorna',
        kind: 17,
        insertText: snippetCode,
        insertTextRules: 4,
        range: {
          startLineNumber: 1,
          endLineNumber: 1,
          startColumn: 1,
          endColumn: 4,
        },
      }),
      expect.objectContaining({
        label: 'precoFinal',
        kind: 4,
        insertText: 'precoFinal',
      }),
    ])
    expect(completionList.suggestions[1]?.insertTextRules).toBeUndefined()
  })

  it('should include dynamic completions from the current model code', () => {
    lspProvider = new DeleguaProvedorLsp()
    const { result } = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const editor = {} as monaco.editor.IStandaloneCodeEditor

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    const model = {
      getValue: jest.fn(
        () =>
          'variavel minha_variavel = 10\nfuncao calcular_total(valor_base, incremento_extra) {\n\tretorna valor_base + incremento_extra\n}',
      ),
      getWordUntilPosition: jest.fn(() => ({
        word: 'pre',
        startColumn: 1,
        endColumn: 4,
      })),
    } as unknown as monaco.editor.ITextModel
    const position = {
      lineNumber: 2,
      column: 4,
    } as monaco.Position

    const completionList = monaco.completionProvider?.provideCompletionItems(
      model,
      position,
    )

    if (!completionList || 'then' in completionList) {
      throw new Error('Completion list should be synchronous')
    }

    const labels = completionList.suggestions.map((suggestion) => suggestion.label)
    const functionSuggestion = completionList.suggestions.find(
      (suggestion) => suggestion.label === 'calcular_total',
    )

    expect(labels).toEqual(
      expect.arrayContaining([
        'retorna',
        'minha_variavel',
        'calcular_total',
        'valor_base',
        'incremento_extra',
      ]),
    )
    expect(functionSuggestion).toEqual(
      expect.objectContaining({
        insertText: dynamicFunctionSnippetCode,
        insertTextRules: 4,
      }),
    )
  })

  it('should dispose registered Monaco providers on remount and unmount', () => {
    const { result, unmount } = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const editor = {} as monaco.editor.IStandaloneCodeEditor

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })
    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    expect(monaco.disposables[0]?.dispose).toHaveBeenCalledTimes(1)
    expect(monaco.disposables[1]?.dispose).toHaveBeenCalledTimes(1)

    unmount()

    expect(monaco.disposables[2]?.dispose).toHaveBeenCalledTimes(1)
    expect(monaco.disposables[3]?.dispose).toHaveBeenCalledTimes(1)
  })

  it('should dispose providers from a previous editor instance before registering another one', () => {
    const firstHook = renderCodeEditorHook()
    const secondHook = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const editor = {} as monaco.editor.IStandaloneCodeEditor

    act(() => {
      firstHook.result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })
    act(() => {
      secondHook.result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    expect(monaco.disposables[0]?.dispose).toHaveBeenCalledTimes(1)
    expect(monaco.disposables[1]?.dispose).toHaveBeenCalledTimes(1)

    firstHook.unmount()

    expect(monaco.disposables[2]?.dispose).not.toHaveBeenCalled()
    expect(monaco.disposables[3]?.dispose).not.toHaveBeenCalled()

    secondHook.unmount()

    expect(monaco.disposables[2]?.dispose).toHaveBeenCalledTimes(1)
    expect(monaco.disposables[3]?.dispose).toHaveBeenCalledTimes(1)
  })

  it('should dispose providers persisted by a previous module instance', () => {
    const oldHoverProvider = crieDisposable()
    const oldCompletionProvider = crieDisposable()
    globalThis.stardustCodeEditorMonacoProvidersRegistry = {
      owner: Symbol('PreviousCodeEditorMonacoProviders'),
      providers: [oldHoverProvider, oldCompletionProvider],
    }
    const { result } = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const editor = {} as monaco.editor.IStandaloneCodeEditor

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    expect(oldHoverProvider.dispose).toHaveBeenCalledTimes(1)
    expect(oldCompletionProvider.dispose).toHaveBeenCalledTimes(1)
  })

  it('should remain inert when no highlighted ranges are provided', () => {
    const { result } = renderCodeEditorHook()
    const monaco = crieMonacoMock()
    const { editor, deltaDecorations } = crieEditorMock()

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    expect(deltaDecorations).not.toHaveBeenCalled()
    expect(editor.getVisibleRanges).not.toHaveBeenCalled()
    expect(lspProvider.performSyntaxAnalysis).not.toHaveBeenCalled()
    expect(lspProvider.getCompletions).not.toHaveBeenCalled()
  })

  it('should apply all highlighted ranges and reveal the first range outside with context', () => {
    const highlightedLineRanges = [
      { startLine: 2, endLine: 3 },
      { startLine: 8, endLine: 9 },
      { startLine: 15, endLine: 15 },
    ]
    const { result } = renderCodeEditorHook(highlightedLineRanges)
    const monaco = crieMonacoMock()
    const { editor, deltaDecorations } = crieEditorMock([
      { startLineNumber: 1, endLineNumber: 4 } as monaco.Range,
    ])

    act(() => {
      result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })

    expect(deltaDecorations).toHaveBeenCalledWith(
      [],
      [
        expect.objectContaining({
          range: {
            startLineNumber: 2,
            startColumn: 1,
            endLineNumber: 3,
            endColumn: 1,
          },
          options: {
            className: 'code-editor-active-line',
            isWholeLine: true,
          },
        }),
        expect.objectContaining({
          range: {
            startLineNumber: 8,
            startColumn: 1,
            endLineNumber: 9,
            endColumn: 1,
          },
        }),
        expect.objectContaining({
          range: {
            startLineNumber: 15,
            startColumn: 1,
            endLineNumber: 15,
            endColumn: 1,
          },
        }),
      ],
    )
    expect(editor.revealLinesInCenterIfOutsideViewport).toHaveBeenCalledWith(7, 10)
  })

  it('should replace previous decorations, reveal only when needed, and clean up on unmount', () => {
    const initialRanges = [{ startLine: 2, endLine: 2 }]
    const updatedRanges = [{ startLine: 5, endLine: 6 }]
    const hook = renderCodeEditorHook(initialRanges)
    const monaco = crieMonacoMock()
    const { editor, deltaDecorations } = crieEditorMock([
      { startLineNumber: 1, endLineNumber: 20 } as monaco.Range,
    ])

    act(() => {
      hook.result.current.handleEditorDidMount(editor, monaco.monacoMock)
    })
    expect(editor.revealLinesInCenterIfOutsideViewport).not.toHaveBeenCalled()

    hook.rerender({ highlightedLineRanges: updatedRanges })
    expect(deltaDecorations).toHaveBeenCalledTimes(2)
    expect(deltaDecorations.mock.calls[1]?.[0]).toEqual(['decoration-1'])
    expect(deltaDecorations.mock.calls[1]?.[1]).toEqual([
      expect.objectContaining({
        range: expect.objectContaining({
          startLineNumber: 5,
        }),
      }),
    ])

    hook.unmount()
    expect(deltaDecorations).toHaveBeenCalledWith(['decoration-2'], [])
  })
})
