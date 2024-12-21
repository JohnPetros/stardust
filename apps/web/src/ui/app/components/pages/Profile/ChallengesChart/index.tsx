'use client'

import type { UserDto } from '#dtos'
import { _countCompletedChallengesByDifficultyLevel } from './_countCompletedChallengesByDifficultyLevel'
import { Legend } from './Legend'
import { Chart } from './ApexChallengesChart'
import { useChallengesChart } from './useChallengesChart'

type ChallengesChartProps = {
  userDto: UserDto
}

export function ChallengesChart({ userDto }: ChallengesChartProps) {
  const { chartData } = useChallengesChart(
    userDto,
    _countCompletedChallengesByDifficultyLevel,
  )

  console.log(chartData)

  if (chartData)
    return (
      <div className='flex'>
        <Chart size={280} chartData={chartData} />

        <dl className='-ml-20 flex flex-col gap-3'>
          <Legend
            label='Fácil'
            value={chartData.absolute.easy}
            total={chartData.total.easy}
            color='bg-green-500'
          />
          <Legend
            label='Médio'
            value={chartData.absolute.medium}
            total={chartData.total.medium}
            color='bg-yellow-400'
          />
          <Legend
            label='Difícil'
            value={chartData.absolute.hard}
            total={chartData.total.hard}
            color='bg-red-700'
          />
        </dl>
      </div>
    )
}
