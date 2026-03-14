'use client'

import type { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'
import { RealtimeContextProvider } from '@/ui/global/contexts/RealtimeContext'
import { RestContextProvider } from '@/ui/global/contexts/RestContext'

type ClientProps = {
  children: ReactNode
}

export const ClientProviders = ({ children }: ClientProps) => {
  return (
    <TooltipProvider>
      <RestContextProvider>
        <RealtimeContextProvider>
          <EditorProvider>{children}</EditorProvider>
        </RealtimeContextProvider>
      </RestContextProvider>
    </TooltipProvider>
  )
}
