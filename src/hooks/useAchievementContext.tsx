'use client'

import { AchivementsContext } from '@/contexts/AchievementsContext'
import { useContext } from 'react'

export function useAchivementsContext() {
  const context = useContext(AchivementsContext)

  if (!context) {
    throw new Error('useAchivementContext must be used inside AchivementsContext')
  }

  return context
}
