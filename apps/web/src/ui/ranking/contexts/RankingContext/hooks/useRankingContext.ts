'use client'

import { useContext } from 'react'

import { AppError } from '@/@core/errors/global/AppError'
import { RankingContext } from '..'

export function useRankingContext() {
  const context = useContext(RankingContext)

  if (!context) {
    throw new AppError(' must be used inside AchivementsContext')
  }

  return context
}
