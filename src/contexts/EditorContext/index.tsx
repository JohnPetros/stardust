'use client'

import { createContext, ReactNode } from 'react'

import { useEditorProvider } from './hooks/useEditorProvider'
import { EditorContextValue } from './types/EditorContextValue'

type EditorProviderProps = {
  children: ReactNode
}

export const EditorContext = createContext({} as EditorContextValue)

export function EditorProvider({ children }: EditorProviderProps) {
  const { state, dispatch } = useEditorProvider()

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}
