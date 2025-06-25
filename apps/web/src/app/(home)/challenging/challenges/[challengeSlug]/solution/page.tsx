import { Challenge } from '@stardust/core/challenging/entities'

import { Slug } from '@stardust/core/global/structures'

import type { NextParams } from '@/rpc/next/types'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'

const Slot = async ({ params }: NextParams<'challengeSlug'>) => {
  const restClient = await NextServerRestClient()
  const service = ChallengingService(restClient)
  const response = await service.fetchChallengeBySlug(Slug.create(params.challengeSlug))
  if (response.isFailure) response.throwError()
  const challenge = Challenge.create(response.body)

  return (
    <SolutionPage
      challengeId={challenge.id.value}
      challengeSlug={challenge.slug.value}
      savedSolutionDto={null}
    />
  )
}

export default Slot
