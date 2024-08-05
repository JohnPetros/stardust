'use client'

import { useEffect, useState } from 'react'
import type { UserDTO } from '@/@core/dtos'
import type { CompletedChallengesCountByDifficultyLevel } from '@/@core/domain/types'
import type { _countCompletedChallengesByDifficultyLevel } from './_countCompletedChallengesByDifficultyLevel'

export function useChallengesChart(
  userDTO: UserDTO,
  countCompletedChallengesByDifficultyLevel: typeof _countCompletedChallengesByDifficultyLevel
) {
  const [chartData, setChartData] =
    useState<CompletedChallengesCountByDifficultyLevel | null>(null)

  useEffect(() => {
    async function loadData() {
      const data = await countCompletedChallengesByDifficultyLevel(userDTO)

      setChartData(data)
    }

    loadData()
  }, [userDTO, countCompletedChallengesByDifficultyLevel])

  return {
    chartData,
  }
}
