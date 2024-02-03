'use client'

import { useReducer } from 'react'

import { EditorContextAction } from '../types/editorContextAction'
import { EditorContextState } from '../types/editorContextState'

import { EDITOR_DEFAULT_CONFIG, STORAGE } from '@/utils/constants'

const EditorContextState: EditorContextState = {
  fontSize: EDITOR_DEFAULT_CONFIG.fontSize,
  tabSize: EDITOR_DEFAULT_CONFIG.tabSize,
  theme: EDITOR_DEFAULT_CONFIG.theme,
}

export function useEditorProvider() {
  const [state, dispatch] = useReducer(EditorReducer, EditorContextState)

  function getEditorConfig(): EditorContextState {
    const storedData = localStorage.getItem(STORAGE.editorConfig)

    const editorData = storedData
      ? JSON.parse(storedData)
      : EDITOR_DEFAULT_CONFIG

    return editorData
  }

  function storeEditorConfig(
    currentEditorData: EditorContextState,
    newEditorData: Partial<EditorContextState>
  ) {
    localStorage.setItem(
      STORAGE.editorConfig,
      JSON.stringify({ ...currentEditorData, ...newEditorData })
    )
    return getEditorConfig()
  }

  function EditorReducer(
    state: EditorContextState,
    action: EditorContextAction
  ): EditorContextState {
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

  return {
    state,
    dispatch,
  }
}
