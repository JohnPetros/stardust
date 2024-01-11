import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { useSiderbar } from '@/contexts/SidebarContext'

export function useLayout() {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const {
    isOpen,
    toggle,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
  } = useSiderbar()

  const pathName = usePathname()

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleMainContainerClick() {
    if (isOpen) toggle()
    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  const isChallengePage = new RegExp(
    '^/challenges/[0-9a-fA-F-]+(\\?.*)?$'
  ).test(pathName)

  return {
    isSidenavExpanded,
    isChallengePage,
    toggleSidenav,
    handleMainContainerClick,
  }
}
