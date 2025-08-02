import { createContext, useRef, type PropsWithChildren } from 'react'

import type { TextEditorContextValue } from './TextEditorContextValue'
import { useTextEditorContextProvider } from './useTextEditorContextProvider'
import type { TextEditorRef } from '@/ui/global/widgets/components/textEditor/types'

export const TextEditorContext = createContext({} as TextEditorContextValue)

export const TextEditorContextProvider = ({ children }: PropsWithChildren) => {
  const textEditorRef = useRef<TextEditorRef>(null)
  const textEditorContextValue = useTextEditorContextProvider(textEditorRef)

  return (
    <TextEditorContext.Provider value={textEditorContextValue}>
      {children}
    </TextEditorContext.Provider>
  )
}
