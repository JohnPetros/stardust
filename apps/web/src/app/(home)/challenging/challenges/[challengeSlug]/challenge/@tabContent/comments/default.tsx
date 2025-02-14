import { challengingActions } from '@/server/next-safe-action'
import type { NextParams } from '@/server/next/types'
import { ChallengeCommentsSlot } from '@/ui/challenging/widgets/slots/ChallengeComments'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  const response = await challengingActions.accessChallengeCommentsSlot({
    challengeSlug: params.challengeSlug,
  })
  if (response?.data?.challengeId)
    return <ChallengeCommentsSlot challengeId={String(response.data?.challengeId)} />
}
