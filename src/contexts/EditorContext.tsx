'use client'

import { createContext, ReactNode, useReducer } from 'react'

import type { ThemeName } from '@/@types/themeName'
import { EDITOR_DEFAULT_CONFIG } from '@/utils/constants'

export type EditorState = {
  fontSize: number
  tabSize: number
  theme: ThemeName
}

type EditorAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: ThemeName }

type EditorValue = {
  state: EditorState
  dispatch: (action: EditorAction) => void
}

interface EditorProviderProps {
  children: ReactNode
}

export const EditorContext = createContext({} as EditorValue)

const initialEditorState: EditorState = {
  fontSize: EDITOR_DEFAULT_CONFIG.fontSize,
  tabSize: EDITOR_DEFAULT_CONFIG.tabSize,
  theme: EDITOR_DEFAULT_CONFIG.theme,
}

function getEditorConfig(): EditorState {
  const storedData = localStorage.getItem('@stardust:editor')

  const editorData = storedData ? JSON.parse(storedData) : EDITOR_DEFAULT_CONFIG

  return editorData
}

function storeEditorConfig(
  currentEditorData: EditorState,
  newEditorData: Partial<EditorState>
) {
  localStorage.setItem(
    '@stardust:editor',
    JSON.stringify({ ...currentEditorData, ...newEditorData })
  )
  return getEditorConfig()
}

function EditorReducer(state: EditorState, action: EditorAction): EditorState {
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

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}
