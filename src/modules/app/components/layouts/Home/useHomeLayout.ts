'use client'

import { useEffect, useState } from 'react'

import { STORAGE } from '@/modules/global/constants'
import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSiderbarContext } from '@/modules/app/contexts/SidebarContext'

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

  function handleContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    shouldSkipHomeTransitionAnimation.set('true')

    return () => {
      shouldSkipHomeTransitionAnimation.remove()
    }
  }, [shouldSkipHomeTransitionAnimation])

  return {
    isSidenavExpanded,
    toggleSidenav,
    handleContainerClick,
  }
}
