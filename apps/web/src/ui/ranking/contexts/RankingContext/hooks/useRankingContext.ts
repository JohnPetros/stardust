'use client'

import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'
import { RankingContext } from '..'

export function useRankingContext() {
  const context = useContext(RankingContext)

  if (!context) {
    throw new AppError(' must be used inside AchivementsContext')
  }

  return context
}
