'use client'

import { createContext, type ReactNode } from 'react'

import type { EditorContextValue } from './types'
import { useEditorProvider } from './hooks'

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
