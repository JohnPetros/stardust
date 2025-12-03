'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'

export const ChallengesList = () => {
  const { challengingService } = useRest({ isAuthenticated: false })
  const { challenges, isLoading, isReachedEnd, handleShowMore } =
    useChallengesList(challengingService)

  return (
    <ChallengesListView
      challenges={challenges}
      isLoading={isLoading}
      isReachedEnd={isReachedEnd}
      onShowMore={handleShowMore}
    />
  )
}
