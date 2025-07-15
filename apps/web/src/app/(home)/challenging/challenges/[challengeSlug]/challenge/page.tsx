import { challengingActions } from '@/rpc/next-safe-action'
import type { NextParams } from '@/rpc/next/types'
import { ChallengePage } from '@/ui/challenging/widgets/pages/Challenge'

const Page = async ({ params }: NextParams<'challengeSlug'>) => {
  const { challengeSlug } = await params
  const response = await challengingActions.accessChallengePage({
    challengeSlug,
  })
  if (!response?.data) return

  return (
    <ChallengePage
      challengeDto={response.data.challengeDto}
      userChallengeVote={response.data.userChallengeVote}
    />
  )
}

export default Page
