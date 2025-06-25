import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { AuthService, ChallengingService } from '@/rest/services'
import type { NextParams } from '@/rpc/next/types'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'
import { Challenge } from '@stardust/core/challenging/entities'
import { NotSolutionAuthorError } from '@stardust/core/challenging/errors'
import { Slug } from '@stardust/core/global/structures'

const Page = async ({ params }: NextParams<'challengeSlug' | 'solutionSlug'>) => {
  const restClient = await NextServerRestClient()
  const challengingService = ChallengingService(restClient)
  const challengeResponse = await challengingService.fetchChallengeBySlug(
    Slug.create(params.challengeSlug),
  )
  if (challengeResponse.isFailure) challengeResponse.throwError()
  const challenge = Challenge.create(challengeResponse.body)

  const solutionResponse = await challengingService.fetchSolutionBySlug(
    Slug.create(params.solutionSlug),
  )
  if (solutionResponse.isFailure) solutionResponse.throwError()
  const savedSolutionDto = solutionResponse.body

  const authService = AuthService(restClient)
  const authResponse = await authService.fetchAccount()
  const account = authResponse.body
  if (savedSolutionDto.author.id !== account.id) throw new NotSolutionAuthorError()

  return (
    <SolutionPage
      challengeId={challenge.id.value}
      challengeSlug={challenge.slug.value}
      savedSolutionDto={savedSolutionDto}
    />
  )
}

export default Page
