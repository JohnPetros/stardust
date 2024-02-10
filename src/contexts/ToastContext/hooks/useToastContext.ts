import { useContext } from 'react'

import { ToastContext } from '@/contexts/ToastContext'

export function useToastContext() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used inside ToastContext')
  }

  return context
}
