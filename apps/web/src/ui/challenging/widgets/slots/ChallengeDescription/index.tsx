'use client'

import { useRef } from 'react'

import { useChallengeDescriptionSlot } from './useChallengeDescriptionSlot'
import { ChallengeDescriptionSlotView } from './ChallengeDescriptionSlotView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useTextSelection } from './useTextSelection'

export const ChallengeDescriptionSlot = () => {
  const { user } = useAuthContext()
  const {
    mdx,
    isUserChallengeAuthor,
    canManageChallenge,
    isManagingAsAdmin,
    isCompleted,
    challenge,
    isLoading,
  } = useChallengeDescriptionSlot(user)
  const contentRef = useRef<HTMLDivElement>(null)
  const { isAssistantEnabled } = useChallengeStore().getIsAssistantEnabledSlice()
  const { setTextSelection } = useChallengeStore().getAssistantSelectionsSlice()
  const { isButtonVisible, buttonPosition, handleAddSelection } = useTextSelection({
    containerRef: contentRef,
    setTextSelection,
  })

  return (
    <ChallengeDescriptionSlotView
      isLoading={isLoading}
      challenge={challenge}
      isUserChallengeAuthor={isUserChallengeAuthor}
      canManageChallenge={canManageChallenge}
      isManagingAsAdmin={isManagingAsAdmin}
      isCompleted={isCompleted}
      mdx={mdx}
      contentRef={contentRef}
      isAssistantEnabled={isAssistantEnabled}
      isSelectionButtonVisible={isButtonVisible}
      selectionButtonPosition={buttonPosition}
      onAddTextSelection={handleAddSelection}
    />
  )
}
