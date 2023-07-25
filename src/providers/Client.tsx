'use client'
import { ReactNode } from 'react'
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
        <ToastProvider swipeDirection="right">{children}</ToastProvider>
      </SpaceProvider>
    </SidebarProvider>
  )
}
