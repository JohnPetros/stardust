'use client'

import { createContext, ReactNode, useContext, useReducer } from 'react'

import type { ThemeName } from '@/@types/themeName'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { EDITOR_DEFAULT_CONFIG, STORAGE } from '@/utils/constants'

export type CodeEditorState = {
  fontSize: number
  tabSize: number
  theme: ThemeName
}

type CodeEditorAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: ThemeName }

type CodeEditorValue = {
  state: CodeEditorState
  dispatch: (action: CodeEditorAction) => void
}

type CodeEditorProviderProps = {
  children: ReactNode
}

export const CodeEditorContext = createContext({} as CodeEditorValue)

const initialCodeEditorState: CodeEditorState = {
  fontSize: EDITOR_DEFAULT_CONFIG.fontSize,
  tabSize: EDITOR_DEFAULT_CONFIG.tabSize,
  theme: EDITOR_DEFAULT_CONFIG.theme,
}

export function CodeEditorProvider({ children }: CodeEditorProviderProps) {
  const [state, dispatch] = useReducer(
    CodeEditorReducer,
    initialCodeEditorState
  )

  const localStorage = useLocalStorage()

  function getEditorConfig(): CodeEditorState {
    const storedData = localStorage.getItem(STORAGE.codeEditorConfig)

    const editorData = storedData
      ? JSON.parse(storedData)
      : EDITOR_DEFAULT_CONFIG

    return editorData
  }

  function storeEditorConfig(
    currentEditorData: CodeEditorState,
    newEditorData: Partial<CodeEditorState>
  ) {
    localStorage.setItem(
      STORAGE.codeEditorConfig,
      JSON.stringify({ ...currentEditorData, ...newEditorData })
    )
    return getEditorConfig()
  }

  function CodeEditorReducer(
    state: CodeEditorState,
    action: CodeEditorAction
  ): CodeEditorState {
    switch (action.type) {
      case 'setFontSize':
        return storeEditorConfig(state, { fontSize: action.payload })
      case 'setTabSize':
        return storeEditorConfig(state, { tabSize: action.payload })
      case 'setTheme':
        return storeEditorConfig(state, { theme: action.payload })
      default:
        return state
    }
  }

  return (
    <CodeEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </CodeEditorContext.Provider>
  )
}

export function useCodeEditorContext() {
  const context = useContext(CodeEditorContext)

  if (!context) {
    throw new Error('useCodeEditorContext must be used inside EditorContext')
  }

  return context
}
