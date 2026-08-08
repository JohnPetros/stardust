import type { NextParams } from '@/rpc/next/types'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'
import * as challengingActions from '@/rpc/next-safe-action/challengingActions'

const Slot = async ({ params }: NextParams<'challengeSlug'>) => {
  const { challengeSlug } = await params
  const response = await challengingActions.accessSolutionPage({
    challengeSlug,
  })
  if (!response?.data) return

  return (
    <SolutionPage
      challengeId={response.data.challengeId}
      challengeSlug={challengeSlug}
      savedSolutionDto={response.data.solution}
    />
  )
}

export default Slot
