'use client'

import { useContext } from 'react'

import { AppError } from '@/@core/errors/global/AppError'
import { AchivementsContext } from '..'

export function useAchievementsContext() {
  const context = useContext(AchivementsContext)

  if (!context) {
    throw new AppError('useAchievementsContext must be used inside AchivementsContext')
  }

  return context
}
