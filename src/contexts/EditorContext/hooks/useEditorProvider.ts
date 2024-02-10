'use client'

import { useEffect, useReducer } from 'react'

import { EditorContextAction } from '../types/editorContextAction'
import { EditorContextState } from '../types/editorContextState'

import { EDITOR_DEFAULT_CONFIG, STORAGE } from '@/utils/constants'

export function useEditorProvider() {
  const storedEditorConfig = localStorage.getItem(STORAGE.keys.editorConfig)
  const initalEditorConfigData = storedEditorConfig
    ? JSON.parse(storedEditorConfig)
    : EDITOR_DEFAULT_CONFIG

  const [state, dispatch] = useReducer(EditorReducer, initalEditorConfigData)

  function getEditorConfig(): EditorContextState {
    const storedData = localStorage.getItem(STORAGE.keys.editorConfig)

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

/**
 * 
 * funcao retonerFucao() {
 retorna funcao() {
    retorna 5
 };
}


escreva(retonerFucao()())
 */
