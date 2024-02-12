'use client'

import { useReducer } from 'react'

import { DEFAULT_EDITOR_CONFIG } from '../constants/default-editor-config'
import { EditorContextAction } from '../types/editorContextAction'
import { EditorContextState } from '../types/editorContextState'

import { STORAGE } from '@/global/constants'

export function useEditorProvider() {
  const storedEditorConfig = localStorage.getItem(STORAGE.keys.editorConfig)
  const initalEditorConfigData = storedEditorConfig
    ? JSON.parse(storedEditorConfig)
    : DEFAULT_EDITOR_CONFIG

  const [state, dispatch] = useReducer(EditorReducer, initalEditorConfigData)

  function getEditorConfig(): EditorContextState {
    const storedData = localStorage.getItem(STORAGE.keys.editorConfig)

    const editorData = storedData
      ? JSON.parse(storedData)
      : DEFAULT_EDITOR_CONFIG

    return editorData
  }

  function storeEditorConfig(
    currentEditorData: EditorContextState,
    newEditorData: Partial<EditorContextState>
  ) {
    localStorage.setItem(
      STORAGE.keys.editorConfig,
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
