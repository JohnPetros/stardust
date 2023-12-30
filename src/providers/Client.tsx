'use client'
import '../libs/dayjs'

import { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { AchivementsProvider } from '@/contexts/AchievementsContext'
import { EditorProvider } from '@/contexts/EditorContext'
import { ToastProvider } from '@/contexts/ToastContext'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AchivementsProvider>
          <EditorProvider>{children}</EditorProvider>
        </AchivementsProvider>
      </ToastProvider>
    </TooltipProvider>
  )
}
