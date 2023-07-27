'use client'

import { ReactNode, createContext, useCallback, useState } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  toggle: VoidFunction
}

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarContext = createContext({} as SidebarContextValue)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
