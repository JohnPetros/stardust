'use client'

import { useReducer } from 'react'

import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { STORAGE } from '@/constants'
import { DEFAULT_EDITOR_STATE } from './constants'
import type { EditorContextAction, EditorContextState } from './types'

export function useEditorContextProvider() {
  const editorStorage = useLocalStorage<EditorContextState>(STORAGE.keys.editorState)
  const storedEditorState = editorStorage.get()
  const initalEditorState = hydrateEditorState(storedEditorState)

  function hydrateEditorState(
    editorState?: Partial<EditorContextState> | null,
  ): EditorContextState {
    return {
      ...DEFAULT_EDITOR_STATE,
      ...editorState,
      formatter: {
        ...DEFAULT_EDITOR_STATE.formatter,
        ...editorState?.formatter,
      },
      linter: {
        ...DEFAULT_EDITOR_STATE.linter,
        ...editorState?.linter,
        namingConvention: {
          ...DEFAULT_EDITOR_STATE.linter.namingConvention,
          ...editorState?.linter?.namingConvention,
        },
        consistentParadigm: {
          ...DEFAULT_EDITOR_STATE.linter.consistentParadigm,
          ...editorState?.linter?.consistentParadigm,
        },
      },
    }
  }

  function getEditorConfig(): EditorContextState {
    return hydrateEditorState(editorStorage.get())
  }

  function storeEditorState(
    currentEditorData: EditorContextState,
    newEditorData: Partial<EditorContextState>,
  ) {
    const nextEditorState = hydrateEditorState({ ...currentEditorData, ...newEditorData })

    localStorage.setItem(STORAGE.keys.editorState, JSON.stringify(nextEditorState))

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
      case 'setFormatter':
        return storeEditorState(state, { formatter: action.payload })
      case 'setLinter':
        return storeEditorState(state, { linter: action.payload })
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(EditorReducer, initalEditorState)

  return {
    state,
    dispatch,
    getEditorConfig,
  }
}
