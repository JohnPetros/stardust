'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { BlockedContentAlertDialog } from '../../components/BlockedContentMessage'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ChallengeSolutionsSlotView } from './ChallengeSolutionsSlotView'
import { useChallengeSolutionsSlot } from './useChallengeSolutionsSlot'

export function ChallengeSolutionsSlot() {
  const { challengingService } = useRestContext()
  const { user } = useAuthContext()
  const { challenge } = useChallengeStore().getChallengeSlice()
  const viewProps = useChallengeSolutionsSlot({ challengingService, user, challenge })

  return (
    <BlockedContentAlertDialog content='solutions'>
      <ChallengeSolutionsSlotView {...viewProps} />
    </BlockedContentAlertDialog>
  )
}
