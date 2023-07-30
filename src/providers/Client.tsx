'use client'
import { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Provider as ToastProvider } from '@radix-ui/react-toast'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { SpaceProvider } from '@/contexts/SpaceContext'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
    <SidebarProvider>
      <SpaceProvider>
        <TooltipProvider>
          <ToastProvider swipeDirection="right">{children}</ToastProvider>
        </TooltipProvider>
      </SpaceProvider>
    </SidebarProvider>
  )
}
