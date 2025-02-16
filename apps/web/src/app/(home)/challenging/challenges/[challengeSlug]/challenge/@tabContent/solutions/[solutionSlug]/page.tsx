import { notFound } from 'next/navigation'

import { challengingActions } from '@/server/next-safe-action'
import type { NextParams, NextSearchParams } from '@/server/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'

export const dynamic = 'force-dynamic'

type PageProps = NextParams<{ challengeSlug: string; solutionSlug: string }> &
  NextSearchParams<'isNew'>

export default async function Slot({ params, searchParams }: PageProps) {
  const response = await challengingActions.viewSolution({
    solutionSlug: params.solutionSlug,
  })
  if (!response?.data) notFound()
  const solutionDto = response.data

  return (
    <ChallengeSolutionSlot
      solutionDto={solutionDto}
      isSolutionNew={Boolean(searchParams.isNew)}
      challengeSlug={params.challengeSlug}
    />
  )
}
