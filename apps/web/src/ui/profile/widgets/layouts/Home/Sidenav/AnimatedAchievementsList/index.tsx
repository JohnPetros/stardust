'use client'

import type { ReactNode } from 'react'

import { AnimatedAchievementsListView } from './AnimatedAchievementsListView'

type AnimatedAchievementsListProps = {
  children: ReactNode
  isAchievementsListVisible: boolean
}

export function AnimatedAchievementsList({
  children,
  isAchievementsListVisible,
}: AnimatedAchievementsListProps) {
  return (
    <AnimatedAchievementsListView isAchievementsListVisible={isAchievementsListVisible}>
      {children}
    </AnimatedAchievementsListView>
  )
}
