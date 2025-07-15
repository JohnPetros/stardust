import type { NextParams } from '@/rpc/next/types'
import { SolutionPage } from '@/ui/challenging/widgets/pages/Solution'
import { challengingActions } from '@/rpc/next-safe-action'

const Page = async ({ params }: NextParams<'challengeSlug' | 'solutionSlug'>) => {
  const { challengeSlug, solutionSlug } = await params
  const response = await challengingActions.accessSolutionPage({
    challengeSlug,
    solutionSlug,
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

export default Page
