import { challengingActions } from '@/rpc/next-safe-action'
import type { NextParams } from '@/rpc/next/types'
import { ChallengeCommentsSlot } from '@/ui/challenging/widgets/slots/ChallengeComments'

const Slot = async ({ params }: NextParams<'challengeSlug'>) => {
  const { challengeSlug } = await params
  const response = await challengingActions.accessChallengeCommentsSlot({
    challengeSlug,
  })
  if (response?.data?.challengeId)
    return <ChallengeCommentsSlot challengeId={String(response.data?.challengeId)} />
}

export default Slot
