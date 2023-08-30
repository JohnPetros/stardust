'use client'

import { useContext } from 'react'
import { AchivementsContext } from '@/contexts/AchievementsContext'

export function useAchivementsContext() {
  const context = useContext(AchivementsContext)

  if (!context) {
    throw new Error('useAchivementContext must be used inside AchivementsContext')
  }

  return context
}
