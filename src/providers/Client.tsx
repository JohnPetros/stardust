'use client'
import { ReactNode } from 'react'
import { Provider as ToastProvider } from '@radix-ui/react-toast'
import { SidebarProvider } from '@/contexts/SidebarContext'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
    <SidebarProvider>
      <ToastProvider swipeDirection="right">{children}</ToastProvider>
    </SidebarProvider>
  )
}
