import { useEffect, useState } from 'react'

export type Params = {
  notifyUserChanges: () => void
  isSidebarOpen: boolean
  isAchievementsListVisible: boolean
  onSidebarToggle: VoidFunction
  setIsAchievementsListVisible: (isVisible: boolean) => void
}

export function useHomeLayout({
  notifyUserChanges,
  isSidebarOpen,
  isAchievementsListVisible,
  onSidebarToggle,
  setIsAchievementsListVisible,
}: Params) {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const [hasNotifiedUserChanges, setHasNotifiedUserChanges] = useState(false)

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleContainerClick() {
    if (isSidebarOpen) onSidebarToggle()
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
