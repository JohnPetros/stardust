'use client'

import { useEffect, useState } from 'react'

import { useSiderbar } from '@/contexts/SidebarContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE } from '@/utils/constants'

export function useLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const {
    isOpen,
    toggle,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
  } = useSiderbar()

  const localStorage = useLocalStorage()
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
  }, [localStorage])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleMainContainerClick,
  }
}
