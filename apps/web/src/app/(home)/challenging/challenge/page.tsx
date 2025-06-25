import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const restClient = await NextServerRestClient()
  const challengingService = ChallengingService(restClient)
  const response = await challengingService.fetchAllChallengeCategories()
  if (response.isFailure) response.throwError()
  const categoriesDto = response.body

  return <ChallengeEditorPage challengeCategoriesDto={categoriesDto} />
}
