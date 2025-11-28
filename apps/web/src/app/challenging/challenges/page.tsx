import { CLIENT_ENV } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { ChallengingService } from '@/rest/services/ChallengingService'
import { ChallengesPage } from '@/ui/challenging/widgets/pages/Challenges'

const Page = async () => {
  const restClient = NextRestClient()
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)
  const challengingService = ChallengingService(restClient)
  const response = await challengingService.fetchAllChallengeCategories()
  if (response.isFailure) response.throwError()
  const categoriesDto = response.body

  return <ChallengesPage categoriesDto={categoriesDto} />
}

export default Page
