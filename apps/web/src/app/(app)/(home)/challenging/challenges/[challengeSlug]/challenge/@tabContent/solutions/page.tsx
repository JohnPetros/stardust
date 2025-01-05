import type { NextParams } from '@/server/next/types'
import { ChallengeSolutionsSlot } from '@/ui/challenging/widgets/slots/ChallengeSolutions'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  return <ChallengeSolutionsSlot />
}
