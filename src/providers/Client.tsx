'use client'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ToastProvider } from '@radix-ui/react-toast'

interface ClientProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: 1000 * 60 * 30
    },
  },
})

export function Client({ children }: ClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider swipeDirection="right">{children}</ToastProvider>
    </QueryClientProvider>
  )
}
