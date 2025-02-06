'use client'

import { useEffect, useState } from 'react'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useHomeLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const { isOpen, isAchievementsListVisible, toggle, setIsAchievementsListVisible } =
    useSiderbarContext()
  const { refetchUser, notifyUserChanges } = useAuthContext()

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

  useEffect(() => {
    refetchUser()
    const timeout = setTimeout(() => {
      notifyUserChanges()
    }, 100)

    return () => clearTimeout(timeout)
  }, [notifyUserChanges])

  return {
    isSidenavExpanded,
    isTransitionVisible,
    toggleSidenav,
    handleContainerClick,
  }
}
