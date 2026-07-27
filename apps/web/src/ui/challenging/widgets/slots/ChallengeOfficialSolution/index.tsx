'use client'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { BlockedContentAlertDialog } from '../../components/BlockedContentMessage'
import { ChallengeOfficialSolutionSlotView } from './ChallengeOfficialSolutionSlotView'

export function ChallengeOfficialSolutionSlot() {
  const { challenge } = useChallengeStore().getChallengeSlice()

  return (
    <BlockedContentAlertDialog content='solution'>
      <ChallengeOfficialSolutionSlotView
        challengeSlug={challenge?.slug.value ?? ''}
        officialSolution={challenge?.officialSolution?.dto ?? null}
      />
    </BlockedContentAlertDialog>
  )
}
