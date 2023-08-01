'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

import { Legend } from './Legend'

const options: ApexOptions = {
  chart: {
    type: 'radialBar',
    offsetX: -50,
  },
  fill: {
    colors: ['#FF3737', '#FFCE31', '#0FE983'],
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
          fontSize: '20',
          color: '#EBEBEB',
          offsetY: 0,
        },
        total: {
          color: '#AFB6C2',
          show: true,
          label: 'Total',
          formatter: () => '800',
        },
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Fácil', 'Médio', 'Difícil'],
}

const series = [50, 50, 50]

export function ChallengesChart() {
  return (
    <div className="flex">
      <Chart
        type="radialBar"
        width={280}
        height={280}
        series={series}
        options={options}
      />
      <dl className="flex flex-col gap-3 -ml-20">
        <Legend label="Fácil" value={22} total={25} color="bg-green-500" />
        <Legend label="Médio" value={18} total={20} color="bg-yellow-400" />
        <Legend label="Difícil" value={3} total={6} color="bg-red-700" />
      </dl>
    </div>
  )
}
