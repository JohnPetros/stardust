'use client'

import { ReactNode, createContext, useEffect, useReducer } from 'react'

import { EDITOR_DEFAULT_DATA } from '@/utils/constants'

import type { ThemeName } from '@/types/themeName'

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
  fontSize: EDITOR_DEFAULT_DATA.fontSize,
  tabSize: EDITOR_DEFAULT_DATA.tabSize,
  theme: EDITOR_DEFAULT_DATA.theme,
}

function getEditorData(): EditorState {
  const storedData = localStorage.getItem('@stardust:editor')

  const editorData = storedData ? JSON.parse(storedData) : EDITOR_DEFAULT_DATA

  console.log({ editorData })

  return editorData
}

function storeEditorData(
  currentEditorData: EditorState,
  newEditorData: Partial<EditorState>
) {
  console.log({ ...currentEditorData, ...newEditorData })

  localStorage.setItem(
    '@stardust:editor',
    JSON.stringify({ ...currentEditorData, ...newEditorData })
  )
  return getEditorData()
}

function EditorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'setFontSize':
      return storeEditorData(state, { fontSize: action.payload })
    case 'setTabSize':
      return storeEditorData(state, { tabSize: action.payload })
    case 'setTheme':
      return storeEditorData(state, { theme: action.payload })
    default:
      return state
  }
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)

  useEffect(() => {
    const editorData = getEditorData()

    dispatch({ type: 'setFontSize', payload: editorData.fontSize })
    dispatch({ type: 'setTabSize', payload: editorData.tabSize })
    dispatch({ type: 'setTheme', payload: editorData.theme })
  }, [])

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}
