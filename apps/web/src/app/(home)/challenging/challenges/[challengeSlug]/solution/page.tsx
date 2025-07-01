import type { NextParams } from '@/rpc/next/types'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'
import { challengingActions } from '@/rpc/next-safe-action'

const Slot = async ({ params }: NextParams<'challengeSlug'>) => {
  const response = await challengingActions.accessSolutionPage({
    challengeSlug: params.challengeSlug,
  })
  if (!response?.data) return

  return (
    <SolutionPage
      challengeId={response.data.challengeId}
      challengeSlug={params.challengeSlug}
      savedSolutionDto={response.data.solution}
    />
  )
}

export default Slot
