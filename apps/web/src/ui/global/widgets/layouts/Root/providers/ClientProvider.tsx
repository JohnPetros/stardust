'use client'

import type { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

type ClientProps = {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProps) {
  return (
    <TooltipProvider>
      {/* <EditorProvider> */}
      {children}
      {/* </EditorProvider> */}
    </TooltipProvider>
  )
}
