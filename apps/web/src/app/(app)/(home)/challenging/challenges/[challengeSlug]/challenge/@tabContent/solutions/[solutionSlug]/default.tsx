import { notFound } from 'next/navigation'

import { challengingActions } from '@/server/next-safe-action'
import type { NextParams } from '@/server/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'

export const dynamic = 'force-dynamic'

export default async function DefaultSlot({
  params,
}: NextParams<{ challengeSlug: string; solutionSlug: string }>) {
  const response = await challengingActions.viewSolution({
    solutionSlug: params.solutionSlug,
  })
  if (!response?.data) notFound()
  const solutionDto = response.data

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      challengeSlug={params.challengeSlug}
    />
  )
}
