'use client'

import { useRef } from 'react'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { HomeHeaderView } from './HomeHeaderView'
import { useHomeHeader } from './useHomeHeader'

export function HomeHeader() {
  const streakAnimationRef = useRef<AnimationRef | null>(null)
  const { isOpen, toggle } = useSiderbarContext()
  const { user } = useHomeHeader(streakAnimationRef)

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
      streakAnimationRef={streakAnimationRef}
      onSidebarToggle={toggle}
    />
  )
}
