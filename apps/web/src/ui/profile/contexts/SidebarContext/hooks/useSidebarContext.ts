'use client'

import { useContext } from 'react'

import { SidebarContext } from '..'

export function useSidebarContext() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebarContext must be used inside SidebarProvider')
  }

  return context
}
