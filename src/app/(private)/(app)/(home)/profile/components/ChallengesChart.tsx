'use client'
import { useChallenge } from '@/hooks/useChallenge'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { Legend } from './Legend'

import { getChallengesChatOptions } from '@/utils/helpers'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type Difficulty = 'easy' | 'medium' | 'hard'

type TotalChallengesByDifficulty = {
  easy: number
  medium: number
  hard: number
} & Record<Difficulty, number>

interface ChallengesChartProps {
  userId: string
}

export function ChallengesChart({ userId }: ChallengesChartProps) {
  const [totalChallengesByDifficulty, setTotalChallengesByDifficulty] =
    useState<TotalChallengesByDifficulty | null>(null)

  const { challenges } = useChallenge(null, userId)

  function getCompletedChallengesCountByDifficulty(difficulty: Difficulty) {
    if (challenges?.length) {
      return challenges?.filter(
        (challenge) =>
          challenge.difficulty === difficulty && challenge.isCompleted
      ).length
    }
    return 0
  }

  function getCompletedChallengesPercentageByDifficulty(
    difficulty: Difficulty
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

  function countTotalChallengesByDifficulty() {
    if (challenges?.length) {
      const totalChallengesBydifficulties: TotalChallengesByDifficulty = {
        easy: 0,
        medium: 0,
        hard: 0,
      }

      for (const difficulty in totalChallengesBydifficulties) {
        totalChallengesBydifficulties[difficulty as Difficulty] =
          challenges.filter(
            (challenge) => challenge.difficulty === difficulty
          ).length
      }

      setTotalChallengesByDifficulty(totalChallengesBydifficulties)
    }
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
    countTotalChallengesByDifficulty()
  }, [challenges])

  return (
    <div className="flex">
      <Chart
        type="radialBar"
        width={280}
        height={280}
        series={series}
        options={options}
      />
      {totalChallengesByDifficulty && (
        <dl className="flex flex-col gap-3 -ml-20">
          <Legend
            label="Fácil"
            value={getCompletedChallengesCountByDifficulty('easy')}
            total={totalChallengesByDifficulty.easy}
            color="bg-green-500"
          />
          <Legend
            label="Médio"
            value={getCompletedChallengesCountByDifficulty('medium')}
            total={totalChallengesByDifficulty.medium}
            color="bg-yellow-400"
          />
          <Legend
            label="Difícil"
            value={getCompletedChallengesCountByDifficulty('hard')}
            total={totalChallengesByDifficulty.hard}
            color="bg-red-700"
          />
        </dl>
      )}
    </div>
  )
}
