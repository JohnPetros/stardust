'use client'

import { useEffect, useState } from 'react'
import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'
import { useCountCompletedChallengesByDifficultyLevelAction } from './useCountCompletedChallengesByDifficultyLevelAction'

export function useChallengesChart() {
  const [chartData, setChartData] =
    useState<CompletedChallengesCountByDifficultyLevel | null>(null)
  const { countCompletedChallengesByDifficultyLevel } =
    useCountCompletedChallengesByDifficultyLevelAction()

  useEffect(() => {
    async function loadData() {
      const data = await countCompletedChallengesByDifficultyLevel()

      setChartData(data)
    }

    loadData()
  }, [countCompletedChallengesByDifficultyLevel])

  return {
    chartData,
  }
}
