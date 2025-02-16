import { notFound } from 'next/navigation'

import { challengingActions } from '@/server/next-safe-action'
import type { NextParams } from '@/server/next/types'
import { ChallengePage } from '@/ui/challenging/widgets/pages/Challenge'

export default async function Page({ params }: NextParams<{ challengeSlug: string }>) {
  const response = await challengingActions.accessChallengePage({
    challengeSlug: params.challengeSlug,
  })
  if (!response?.data) notFound()

  return (
    <ChallengePage
      challengeDto={response.data.challengeDto}
      userChallengeVote={response.data.userChallengeVote}
    />
  )
}
