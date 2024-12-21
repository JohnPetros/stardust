'use client'

import type { CompletedChallengesCountByDifficultyLevel } from '@/@core/domain/types'
import type { ApexOptions } from 'apexcharts'

export function useApexChallengesChart(
  chartData: CompletedChallengesCountByDifficultyLevel
) {
  const total =
    chartData.absolute.easy + chartData.absolute.medium + chartData.absolute.hard

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetX: -50,
    },
    fill: {
      colors: ['#0FE983', '#FFCE31', '#FF3737'],
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '30%',
        },
        track: {
          background: '#1E2626',
        },
        dataLabels: {
          name: {
            offsetY: -10,
          },
          value: {
            fontWeight: 'bold',
            fontSize: '18',
            color: '#EBEBEB',
            offsetY: 0,
          },
          total: {
            color: '#AFB6C2',
            show: true,
            label: 'Total',
            formatter: () => total.toString(),
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Fácil', 'Médio', 'Difícil'],
  }

  const series = [
    chartData.absolute.easy,
    chartData.absolute.medium,
    chartData.absolute.hard,
  ]

  return { options, series }
}
