import { useContext } from 'react'

import { TextEditorContext } from '@/ui/auth/contexts/TextEditorContext'

export function useTextEditorContext() {
  const context = useContext(TextEditorContext)

  if (!context) {
    throw new Error(
      'useTextEditorContext must be used within a TextEditorContextProvider',
    )
  }

  return context
}
