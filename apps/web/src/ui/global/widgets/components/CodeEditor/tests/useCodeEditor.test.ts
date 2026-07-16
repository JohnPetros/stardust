import { act, renderHook } from '@testing-library/react'
import type { Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'
import { type Mock, mock } from 'ts-jest-mocker'

import type { LspProvider } from '@stardust/core/global/interfaces'
import type { LspCompletion } from '@stardust/core/global/types'

import { useCodeEditor } from '../useCodeEditor'

let lspProvider: Mock<LspProvider>

const snippetCode = 'retorna $' + '{1:valor}'

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

function useTestCodeEditor() {
  return useCodeEditor({
    initialValue: '',
    theme: 'dark-space',
    isCodeCheckerEnabled: false,
    lspProvider,
    lspDocumentations: [],
    onChange: jest.fn(),
  })
}

function renderCodeEditorHook() {
  return renderHook(useTestCodeEditor)
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
    lspProvider.getCompletions.mockReturnValue(completions)
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
})
