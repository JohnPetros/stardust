'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSidebarContext } from '@/ui/profile/contexts/SidebarContext'
import { HomeNavigationView } from './HomeNavigationView'
import { useHomeNavigation } from './useHomeNavigation'

type HomeNavigationProps = {
  isSidenavExpanded: boolean
  onSidenavToggle: VoidFunction
}

export function HomeNavigation({
  isSidenavExpanded,
  onSidenavToggle,
}: HomeNavigationProps) {
  const { user } = useAuthContext()
  const { currentRoute, goTo } = useNavigationProvider()
  const sidebar = useSidebarContext()
  const navigation = useHomeNavigation({
    user,
    currentRoute,
    goTo,
    isAchievementsListVisible: sidebar.isAchievementsListVisible,
    setIsAchievementsListVisible: sidebar.setIsAchievementsListVisible,
  })

  if (!navigation.sidebarUser) return null

  return (
    <HomeNavigationView
      isSidenavExpanded={isSidenavExpanded}
      onSidenavToggle={onSidenavToggle}
      isSidebarOpen={sidebar.isOpen}
      onSidebarToggle={sidebar.toggle}
      isAchievementsListVisible={sidebar.isAchievementsListVisible}
      links={navigation.links}
      isNotesActive={navigation.isNotesActive}
      rescueableAchievementsCount={navigation.rescueableAchievementsCount}
      sidebarUser={navigation.sidebarUser}
      onNotesClick={navigation.handleNotesClick}
      onAchievementsClick={navigation.handleAchievementsClick}
    />
  )
}
