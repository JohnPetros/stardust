import { CLIENT_ENV } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { ChallengingService } from '@/rest/services/ChallengingService'
import { ChallengeRoadmap } from '@/ui/challenging/widgets/pages/ChallengeRoadmap'

export const dynamic = 'force-dynamic'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Não foi possível carregar o roadmap.'
}

const Page = async () => {
  const restClient = NextRestClient({ isCacheEnabled: false })
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)
  try {
    const response = await ChallengingService(restClient).fetchChallengeRoadmap()

    if (response.isFailure) {
      return <ChallengeRoadmap initialError={response.errorMessage} />
    }

    return <ChallengeRoadmap initialRoadmap={response.body} />
  } catch (error) {
    return <ChallengeRoadmap initialError={getErrorMessage(error)} />
  }
}

export default Page
