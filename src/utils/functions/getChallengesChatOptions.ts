import { ApexOptions } from 'apexcharts'

export function getChallengesChatOptions(totalCompletedChallenges: number) {
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
            formatter: () => totalCompletedChallenges.toString(),
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Fácil', 'Médio', 'Difícil'],
  }

  return options
}
