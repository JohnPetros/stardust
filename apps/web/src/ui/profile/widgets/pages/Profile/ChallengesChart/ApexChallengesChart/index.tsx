'use client'

import dynamic from 'next/dynamic'
import { useApexChallengesChart } from './useApexChallengesChart'
import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'

const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type ApexChallengesChartProps = {
  size: number
  chartData: CompletedChallengesCountByDifficultyLevel
}

function ApexChallengesChart({ size, chartData }: ApexChallengesChartProps) {
  const { options, series } = useApexChallengesChart(chartData)

  return (
    <ApexChart
      type='radialBar'
      width={size}
      height={size}
      options={options}
      series={series}
    />
  )
}

export { ApexChallengesChart as Chart }
