import type { NextParams, NextSearchParams } from '@/rpc/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services'

import { Slug } from '@stardust/core/global/structures'

export const dynamic = 'force-dynamic'

type PageProps = NextParams<'challengeSlug' | 'solutionSlug'> & NextSearchParams<'isNew'>

const DefaultSlot = async ({ params, searchParams }: PageProps) => {
  const restClient = await NextServerRestClient()
  const service = ChallengingService(restClient)
  const response = await service.viewSolution(Slug.create(params.solutionSlug))
  if (response.isFailure) response.throwError()
  const solutionDto = response.body

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      isSolutionNew={Boolean(searchParams.isNew)}
      challengeSlug={params.challengeSlug}
    />
  )
}

export default DefaultSlot
