'use client'

import type { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'
import { AudioContextProvider } from '@/ui/global/contexts/AudioContext'

type ClientProps = {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProps) {
  return (
    <AudioContextProvider>
      <TooltipProvider>
        <EditorProvider>{children}</EditorProvider>
      </TooltipProvider>
    </AudioContextProvider>
  )
}
