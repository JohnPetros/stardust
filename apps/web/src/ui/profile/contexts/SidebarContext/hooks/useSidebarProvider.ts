'use client'

import { useState } from 'react'

export function useSidebarProvider() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAchievementsListVisible, setIsAchievementsListVisible] = useState(false)

  function toggle() {
    setIsOpen((isOpen) => !isOpen)
  }

  return {
    isOpen,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
    toggle,
  }
}
