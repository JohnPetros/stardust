'use client'

import type { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'

type ClientProps = {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProps) {
  return (
    <TooltipProvider>
      <EditorProvider>{children}</EditorProvider>
    </TooltipProvider>
  )
}
