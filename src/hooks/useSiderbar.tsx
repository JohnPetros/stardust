'use client'

import { SidebarContext } from '@/contexts/SidebarContext'
import { useContext } from 'react'

export function useSiderbar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSiderbar must be used inside SidebarProvider')
  }

  return context
}
