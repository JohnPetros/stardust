'use client'

import { useEffect, useState } from 'react'

import { ChallengeDifficulty } from '@/@types/Challenge'
import type { ChallengeSummary } from '@/@types/ChallengeSummary'
import { CACHE } from '@/global/constants/cache'
import { getChallengesChatOptions } from '@/global/helpers'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

type TotalChallengesByDifficulty = {
  easy: number
  medium: number
  hard: number
} & Record<ChallengeDifficulty, number>

export function useChallengesChart(userId: string) {
  const [totalChallengesByDifficulty, setTotalChallengesByDifficulty] =
    useState<TotalChallengesByDifficulty | null>(null)

  const api = useApi()

  async function getChallengesSummary() {
    if (userId) {
      return api.getChallengesSummary(userId)
    }
  }

  const { data: challenges, error } = useCache<ChallengeSummary[]>({
    key: CACHE.keys.challengesSummary,
    dependencies: [userId],
    fetcher: getChallengesSummary,
  })

  if (error) {
    console.error(error)
    throw new Error(error)
  }

  function getCompletedChallengesCountByDifficulty(
    difficulty: ChallengeDifficulty
  ) {
    if (challenges?.length) {
      return challenges?.filter(
        (challenge) =>
          challenge.difficulty === difficulty && challenge.isCompleted
      ).length
    }
    return 0
  }

  function getCompletedChallengesPercentageByDifficulty(
    difficulty: ChallengeDifficulty
  ) {
    if (totalChallengesByDifficulty && challenges?.length) {
      const totalChallenges = totalChallengesByDifficulty[difficulty]
      if (totalChallenges === 0) return 0

      const completedChallengesCountByDifficulty =
        getCompletedChallengesCountByDifficulty(difficulty)

      return +(
        (completedChallengesCountByDifficulty / totalChallenges) *
        100
      ).toFixed(2)
    }
    return 0
  }

  const options = getChallengesChatOptions(
    challenges?.filter((challenge) => challenge.isCompleted).length ?? 0
  )

  const series = [
    getCompletedChallengesPercentageByDifficulty('easy'),
    getCompletedChallengesPercentageByDifficulty('medium'),
    getCompletedChallengesPercentageByDifficulty('hard'),
  ]

  useEffect(() => {
    function countTotalChallengesByDifficulty() {
      if (challenges?.length) {
        const totalChallengesBydifficulties: TotalChallengesByDifficulty = {
          easy: 0,
          medium: 0,
          hard: 0,
        }

        for (const difficulty in totalChallengesBydifficulties) {
          totalChallengesBydifficulties[difficulty as ChallengeDifficulty] =
            challenges.filter(
              (challenge) => challenge.difficulty === difficulty
            ).length
        }

        setTotalChallengesByDifficulty(totalChallengesBydifficulties)
      }
    }

    countTotalChallengesByDifficulty()
  }, [challenges])

  return {
    series,
    options,
    totalChallengesByDifficulty,
    getCompletedChallengesCountByDifficulty,
  }
}
