'use client'

import { useEffect, useState } from 'react'
import type { UserDto } from '#dtos'
import type { CompletedChallengesCountByDifficultyLevel } from '@/@core/domain/types'
import type { _countCompletedChallengesByDifficultyLevel } from './_countCompletedChallengesByDifficultyLevel'

export function useChallengesChart(
  userDto: UserDto,
  countCompletedChallengesByDifficultyLevel: typeof _countCompletedChallengesByDifficultyLevel,
) {
  const [chartData, setChartData] =
    useState<CompletedChallengesCountByDifficultyLevel | null>(null)

  useEffect(() => {
    async function loadData() {
      const data = await countCompletedChallengesByDifficultyLevel(userDto)

      setChartData(data)
    }

    loadData()
  }, [userDto, countCompletedChallengesByDifficultyLevel])

  return {
    chartData,
  }
}
