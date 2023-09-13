'use client'

import { ReactNode, createContext, useEffect, useReducer } from 'react'

import { EDITOR_DEFAULT_DATA } from '@/utils/constants'

import type { ThemeName } from '@/types/themeName'

export type EditorState = {
  fontSize: number
  theme: ThemeName
}

type EditorAction =
  | { type: 'setFontSize'; payload: number }
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
  theme: EDITOR_DEFAULT_DATA.theme,
}

function storeEditorData(editorData: EditorState) {
  localStorage.setItem('@stardust:editor', JSON.stringify({ editorData }))
}

function getEditorData(): EditorState {
  const storedData = localStorage.getItem('@stardust:editor')

  const editorValue = storedData ? JSON.parse(storedData) : EDITOR_DEFAULT_DATA

  return editorValue
}

function EditorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'setFontSize':
      const newEditorData = {
        ...state,
        fontSize: action.payload,
      }
      storeEditorData(newEditorData)
      return newEditorData
    default:
      return state
  }
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)

  useEffect(() => {
    const editorData = getEditorData()

    dispatch({ type: 'setFontSize', payload: editorData.fontSize })
    dispatch({ type: 'setTheme', payload: editorData.theme })
  }, [])

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}
