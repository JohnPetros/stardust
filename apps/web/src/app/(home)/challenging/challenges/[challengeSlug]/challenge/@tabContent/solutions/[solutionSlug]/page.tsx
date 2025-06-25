import { notFound } from 'next/navigation'

import { challengingActions } from '@/rpc/next-safe-action'
import type { NextParams, NextSearchParams } from '@/rpc/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'
import { ChallengingService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { Slug } from '@stardust/core/global/structures'

export const dynamic = 'force-dynamic'

type PageProps = NextParams<'challengeSlug' | 'solutionSlug'> & NextSearchParams<'isNew'>

export const Slot = async ({ params, searchParams }: PageProps) => {
  const restClient = await NextServerRestClient()
  const service = ChallengingService(restClient)
  const response = await service.fetchSolutionBySlug(Slug.create(params.solutionSlug))
  if (response.isFailure) notFound()
  const solutionDto = response.body

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      isSolutionNew={Boolean(searchParams.isNew)}
      challengeSlug={params.challengeSlug}
    />
  )
}

export default Slot
