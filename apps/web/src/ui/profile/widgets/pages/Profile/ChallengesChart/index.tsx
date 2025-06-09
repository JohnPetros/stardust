import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengesChartView } from './ChallengesChartView'
import { ChallengingService } from '@/rest/services'

export const ChallengesChart = async () => {
  const restClient = await NextServerRestClient()
  const service = ChallengingService(restClient)
  const response = await service.fetchCompletedChallengesByDifficultyLevel()
  if (response.isFailure) response.throwError()
  const chartData = response.body

  return <ChallengesChartView chartData={chartData} />
}
