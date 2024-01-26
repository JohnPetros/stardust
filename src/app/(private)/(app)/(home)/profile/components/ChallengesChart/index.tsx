'use client'

import dynamic from 'next/dynamic'

import { Legend } from './Legend'
import { useChallengesChart } from './useChallengesChart'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type ChallengesChartProps = {
  userId: string
}

export function ChallengesChart({ userId }: ChallengesChartProps) {
  const {
    options,
    series,
    totalChallengesByDifficulty,
    getCompletedChallengesCountByDifficulty,
  } = useChallengesChart(userId)

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
        <dl className="-ml-20 flex flex-col gap-3">
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
