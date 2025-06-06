import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'

import { Legend } from './Legend'
import { Chart } from './ApexChallengesChart'

type Props = {
  chartData: CompletedChallengesCountByDifficultyLevel
}

export const ChallengesChartView = async ({ chartData }: Props) => {
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
