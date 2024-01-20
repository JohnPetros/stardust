'use client'

import { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { AchivementsProvider } from '@/contexts/AchievementsContext'
import { ClientProvider } from '@/contexts/ClientContext'
import { CodeEditorProvider } from '@/contexts/CodeEditorContext'
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
            <CodeEditorProvider>{children}</CodeEditorProvider>
          </AchivementsProvider>
        </TooltipProvider>
      </ToastProvider>
    </ClientProvider>
  )
}
