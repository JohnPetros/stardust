import { useEffect, useState } from 'react'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'

export function useHomeLayout(notifyUserChanges: () => void) {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const { isOpen, isAchievementsListVisible, toggle, setIsAchievementsListVisible } =
    useSiderbarContext()
  const [hasNotifiedUserChanges, setHasNotifiedUserChanges] = useState(false)

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    if (!isTransitionVisible) return

    const timeout = setTimeout(() => setIsTransitionVisible(false), 4000)

    return () => {
      clearTimeout(timeout)
    }
  }, [isTransitionVisible])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasNotifiedUserChanges) {
        notifyUserChanges()
        setHasNotifiedUserChanges(true)
      }
    }, 320)

    return () => {
      clearTimeout(timeout)
    }
  }, [hasNotifiedUserChanges, notifyUserChanges])

  return {
    isSidenavExpanded,
    isTransitionVisible,
    toggleSidenav,
    handleContainerClick,
  }
}
