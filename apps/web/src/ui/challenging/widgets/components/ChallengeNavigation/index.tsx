import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ChallengeNavigationView } from './ChallengeNavigationView'
import type { ReactNode } from 'react'

type Props = {
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
  onPreviousChallengeClick: () => void
  onNextChallengeClick: () => void
  onOpenSidebar: () => void
  sidebarSlot: ReactNode
}

export const ChallengeNavigation = ({
  previousChallengeSlug,
  nextChallengeSlug,
  onPreviousChallengeClick,
  onNextChallengeClick,
  onOpenSidebar,
  sidebarSlot,
}: Props) => {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  if (challenge?.isStarChallenge.isFalse)
    return (
      <>
        <ChallengeNavigationView
          canNavigateToPrevious={Boolean(previousChallengeSlug)}
          canNavigateToNext={Boolean(nextChallengeSlug)}
          onPreviousChallengeClick={onPreviousChallengeClick}
          onNextChallengeClick={onNextChallengeClick}
          onOpenSidebar={onOpenSidebar}
        />
        {sidebarSlot}
      </>
    )
}
