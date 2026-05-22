'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { HOME_LINKS } from '../home-links'
import { ROUTES } from '@/constants'
import { SidenavView } from './SidenavView'

type SidenavProps = {
  isExpanded: boolean
  toggleSidenav: VoidFunction
}

export function Sidenav({ isExpanded, toggleSidenav }: SidenavProps) {
  const { user } = useAuthContext()
  const { goTo, currentRoute } = useNavigationProvider()
  const { isAchievementsListVisible, setIsAchievementsListVisible } = useSiderbarContext()

  if (!user) return null

  function handleAchievementsListButtonClick() {
    setIsAchievementsListVisible(!isAchievementsListVisible)
  }

  const links = HOME_LINKS.map(({ route, icon, label }) => ({
    route: typeof route === 'function' ? route(user.slug.value) : route,
    label,
    icon,
  }))

  return (
    <SidenavView
      isExpanded={isExpanded}
      isAchievementsListVisible={isAchievementsListVisible}
      links={links}
      isNotesActive={currentRoute === ROUTES.notes}
      rescueableAchievementsCount={user.rescueableAchievementsCount.value}
      onToggleSidenav={toggleSidenav}
      onNotesClick={() => goTo(ROUTES.notes)}
      onAchievementsClick={handleAchievementsListButtonClick}
    />
  )
}
