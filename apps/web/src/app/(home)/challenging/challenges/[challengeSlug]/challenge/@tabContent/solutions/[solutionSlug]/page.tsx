import type { NextParams, NextSearchParams } from '@/rpc/next/types'
import { ChallengeSolutionSlot } from '@/ui/challenging/widgets/slots/ChallengeSolution'
import { challengingActions } from '@/rpc/next-safe-action'

export const dynamic = 'force-dynamic'

type PageProps = NextParams<'challengeSlug' | 'solutionSlug'> & NextSearchParams<'isNew'>

const Slot = async ({ params, searchParams }: PageProps) => {
  const response = await challengingActions.viewSolution({
    solutionSlug: params.solutionSlug,
  })
  if (!response?.data) return

  return (
    <ChallengeSolutionSlot
      solutionDto={response.data.solution}
      isSolutionNew={Boolean(searchParams.isNew)}
      challengeSlug={params.challengeSlug}
    />
  )
}

export default Slot
