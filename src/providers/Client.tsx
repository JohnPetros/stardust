'use client'
import { ReactNode } from 'react'
import { Provider as ToastProvider } from '@radix-ui/react-toast'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
      <ToastProvider swipeDirection="right">{children}</ToastProvider>
  )
}
