import { ChallengingService } from '@/rest/services/ChallengingService'
import { ChallengesPage } from '@/ui/challenging/widgets/pages/Challenges'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'

export default async function Page() {
  const restClient = await NextServerRestClient()
  const challengingService = ChallengingService(restClient)
  const response = await challengingService.fetchAllChallengeCategories()
  if (response.isFailure) response.throwError()
  const categoriesDto = response.body

  return <ChallengesPage categoriesDto={categoriesDto} />
}
