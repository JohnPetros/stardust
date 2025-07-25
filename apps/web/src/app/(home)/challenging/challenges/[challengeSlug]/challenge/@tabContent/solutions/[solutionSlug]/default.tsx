import type { NextParams, NextSearchParams } from '@/rpc/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services'

import { Slug } from '@stardust/core/global/structures'

export const dynamic = 'force-dynamic'

type PageProps = NextParams<'challengeSlug' | 'solutionSlug'> & NextSearchParams<'isNew'>

const DefaultSlot = async ({ params, searchParams }: PageProps) => {
  const { solutionSlug, challengeSlug } = await params
  const { isNew } = await searchParams
  const restClient = await NextServerRestClient()
  const service = ChallengingService(restClient)
  const response = await service.viewSolution(Slug.create(solutionSlug))
  if (response.isFailure) response.throwError()
  const solutionDto = response.body

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      isSolutionNew={Boolean(isNew)}
      challengeSlug={challengeSlug}
    />
  )
}

export default DefaultSlot
