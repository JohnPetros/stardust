'use client'

import { useContext } from 'react'

import { SidebarContext } from '..'

export function useSiderbarContext() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSiderbarContext must be used inside SidebarProvider')
  }

  return context
}
