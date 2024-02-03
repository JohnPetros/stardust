'use client'

import { useEffect, useState } from 'react'

import { useSiderbarContext } from '@/contexts/SidebarContext/hooks/useSiderbarContext'
import { STORAGE } from '@/utils/constants'

export function useLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const {
    isOpen,
    toggle,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
  } = useSiderbarContext()

  localStorage.setItem(STORAGE.hasPageAnimationTransition, 'true')

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleMainContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE.hasPageAnimationTransition)
    }
  }, [])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleMainContainerClick,
  }
}
