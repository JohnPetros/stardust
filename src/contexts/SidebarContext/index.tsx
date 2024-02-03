'use client'

import { createContext, ReactNode } from 'react'

import { useSidebarProvider } from './hooks/useSidebarProvider'
import type { SidebarContextValue } from './types/SidebarContextValue'

type SidebarProviderProps = {
  children: ReactNode
}

export const SidebarContext = createContext({} as SidebarContextValue)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const {
    isOpen,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
    toggle,
  } = useSidebarProvider()

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        isAchievementsListVisible,
        setIsAchievementsListVisible,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
