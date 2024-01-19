'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

export type SidebarContextValue = {
  isOpen: boolean
  toggle: VoidFunction
  isAchievementsListVisible: boolean
  setIsAchievementsListVisible: (isAchievementsListVisible: boolean) => void
}

type SidebarProviderProps = {
  children: ReactNode
}

export const SidebarContext = createContext({} as SidebarContextValue)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAchievementsListVisible, setIsAchievementsListVisible] =
    useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

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

export function useSiderbarContext() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSiderbarContext must be used inside SidebarProvider')
  }

  return context
}
