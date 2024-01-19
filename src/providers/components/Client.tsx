'use client'

import { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { AchivementsProvider } from '@/contexts/AchievementsContext'
import { ClientProvider } from '@/contexts/ClientContext'
import { EditorProvider } from '@/contexts/EditorContext'
import { ToastProvider } from '@/contexts/ToastContext'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
    <ClientProvider>
      <ToastProvider>
        <TooltipProvider>
          <AchivementsProvider>
            <EditorProvider>{children}</EditorProvider>
          </AchivementsProvider>
        </TooltipProvider>
      </ToastProvider>
    </ClientProvider>
  )
}
