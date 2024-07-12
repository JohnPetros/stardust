'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSiderbarContext } from '@/modules/app/contexts/SidebarContext'
import { STORAGE } from '@/global/constants'

export function useHomeLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const { isOpen, isAchievementsListVisible, toggle, setIsAchievementsListVisible } =
    useSiderbarContext()

  const shouldSkipHomeTransitionAnimation = useLocalStorage<string>(
    STORAGE.keys.shouldSkipHomeTransitionAnimation
  )

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleMainContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    shouldSkipHomeTransitionAnimation.set('true')

    return shouldSkipHomeTransitionAnimation.remove
  }, [shouldSkipHomeTransitionAnimation])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleMainContainerClick,
  }
}
