'use client'

import { ReactNode, createContext, useState } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  toggle: VoidFunction
  isAchievementsListVisible: boolean
  setIsAchievementsListVisible: (isAchievementsListVisible: boolean) => void
}

interface SidebarProviderProps {
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
