'use client'

import { ToastProvider } from '@/modules/global/contexts/ToastContext'
import { ReactNode } from 'react'

type ClientProps = {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProps) {
  return children

  // return (
  //   <ToastProvider>
  //     {/* <TooltipProvider> */}
  //     {/* <AchivementsProvider> */}
  //     {/* <EditorProvider> */}
  //     {children}
  //     {/* </EditorProvider> */}
  //     {/* </AchivementsProvider> */}
  //     {/* </TooltipProvider> */}
  //   </ToastProvider>
  // )
}
