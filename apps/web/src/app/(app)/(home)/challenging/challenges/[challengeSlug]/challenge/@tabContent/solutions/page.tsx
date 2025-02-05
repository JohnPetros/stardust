import { challengingActions } from '@/server/next-safe-action'
import type { NextParams } from '@/server/next/types'
import { ChallengeSolutionsSlot } from '@/ui/challenging/widgets/slots/ChallengeSolutions'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  await challengingActions.accessChallengeSolutionsSlot({
    challengeSlug: params.challengeSlug,
  })

  return <ChallengeSolutionsSlot />
}
