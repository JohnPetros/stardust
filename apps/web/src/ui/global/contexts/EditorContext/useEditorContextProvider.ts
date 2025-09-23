'use client'

import { useReducer } from 'react'

import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { STORAGE } from '@/constants'
import { DEFAULT_EDITOR_STATE } from './constants'
import type { EditorContextAction, EditorContextState } from './types'

export function useEditorContextProvider() {
  const editorStorage = useLocalStorage<EditorContextState>(STORAGE.keys.editorState)
  const storedEditorState = editorStorage.get()
  const initalEditorState = storedEditorState ? storedEditorState : DEFAULT_EDITOR_STATE

  function getEditorConfig(): EditorContextState {
    const storedState = localStorage.getItem(STORAGE.keys.editorState)
    const editorState = storedState ? JSON.parse(storedState) : DEFAULT_EDITOR_STATE
    return editorState
  }

  function storeEditorState(
    currentEditorData: EditorContextState,
    newEditorData: Partial<EditorContextState>,
  ) {
    localStorage.setItem(
      STORAGE.keys.editorState,
      JSON.stringify({ ...currentEditorData, ...newEditorData }),
    )
    return getEditorConfig()
  }

  const EditorReducer = (
    state: EditorContextState,
    action: EditorContextAction,
  ): EditorContextState => {
    switch (action.type) {
      case 'setFontSize':
        return storeEditorState(state, { fontSize: action.payload })
      case 'setTabSize':
        return storeEditorState(state, { tabSize: action.payload })
      case 'setTheme':
        return storeEditorState(state, { themeName: action.payload })
      case 'setIsCodeCheckerEnabled':
        return storeEditorState(state, { isCodeCheckerEnabled: action.payload })
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(EditorReducer, initalEditorState)

  return {
    state,
    dispatch,
  }
}
