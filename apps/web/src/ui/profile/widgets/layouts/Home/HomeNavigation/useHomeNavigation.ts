import type { User } from '@stardust/core/global/entities'

import { ROUTES } from '@/constants'
import { HOME_LINKS } from '../home-links'

export type Params = {
  user: User | null
  currentRoute: string
  goTo: (route: string) => void
  isAchievementsListVisible: boolean
  setIsAchievementsListVisible: (isVisible: boolean) => void
}

function getLinks(user: User | null) {
  if (!user) return []

  return HOME_LINKS.map(({ route, icon, label }) => ({
    route: typeof route === 'function' ? route(user.slug.value) : route,
    label,
    icon,
  }))
}

function getSidebarUser(user: User | null) {
  if (!user) return null

  return {
    name: user.name.value,
    email: user.email.value,
    avatar: {
      image: user.avatar.image.value,
      name: user.avatar.name.value,
    },
  }
}

export function useHomeNavigation({
  user,
  currentRoute,
  goTo,
  isAchievementsListVisible,
  setIsAchievementsListVisible,
}: Params) {
  function handleNotesClick() {
    goTo(ROUTES.notes)
  }

  function handleAchievementsClick() {
    setIsAchievementsListVisible(!isAchievementsListVisible)
  }

  return {
    links: getLinks(user),
    isNotesActive: currentRoute === ROUTES.notes,
    rescueableAchievementsCount: user?.rescueableAchievementsCount.value ?? 0,
    sidebarUser: getSidebarUser(user),
    handleNotesClick,
    handleAchievementsClick,
  }
}
