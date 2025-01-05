import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'

import { ROUTES } from '@/constants'
import { NextApiClient } from '@/api/next/NextApiClient'
import { Legend } from './Legend'
import { Chart } from './ApexChallengesChart'

export async function ChallengesChart() {
  const apiClient = NextApiClient({ isCacheEnable: false })
  const response = await apiClient.get<CompletedChallengesCountByDifficultyLevel>(
    ROUTES.api.challenging.countByDifficultyLevel,
  )
  if (response.isFailure) return
  const chartData = response.body

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
