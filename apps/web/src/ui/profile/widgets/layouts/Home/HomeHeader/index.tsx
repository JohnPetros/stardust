'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSidebarContext } from '@/ui/profile/contexts/SidebarContext'
import { HomeHeaderView } from './HomeHeaderView'

export function HomeHeader() {
  const { user } = useAuthContext()
  const { isOpen, toggle } = useSidebarContext()

  if (!user) return null

  return (
    <HomeHeaderView
      isSidebarOpen={isOpen}
      rescueableAchievementsCount={user.rescueableAchievementsCount.value}
      coins={user.coins.value}
      streak={user.streak.value}
      isTodayDone={user.weekStatus.isTodayDone.isTrue}
      name={user.name.value}
      email={user.email.value}
      avatarImage={user.avatar.image.value}
      avatarName={user.avatar.name.value}
      onSidebarToggle={toggle}
    />
  )
}
