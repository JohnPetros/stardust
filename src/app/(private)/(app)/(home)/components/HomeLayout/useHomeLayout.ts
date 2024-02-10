'use client'

import { useEffect, useState } from 'react'

import { useSiderbarContext } from '@/contexts/SidebarContext/hooks/useSiderbarContext'
import { STORAGE } from '@/global/constants'

export function useHomeLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const {
    isOpen,
    toggle,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
  } = useSiderbarContext()

  localStorage.setItem(STORAGE.keys.hasPageAnimationTransition, 'true')

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleMainContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE.keys.hasPageAnimationTransition)
    }
  }, [])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleMainContainerClick,
  }
}
