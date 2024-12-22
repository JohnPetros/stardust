'use client'

import { useEffect, useState } from 'react'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'

export function useHomeLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const { isOpen, isAchievementsListVisible, toggle, setIsAchievementsListVisible } =
    useSiderbarContext()

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    if (!isTransitionVisible) return

    const timeout = setTimeout(() => setIsTransitionVisible(false), 2500)

    return () => {
      clearTimeout(timeout)
    }
  }, [isTransitionVisible])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleContainerClick,
    isTransitionVisible,
  }
}
