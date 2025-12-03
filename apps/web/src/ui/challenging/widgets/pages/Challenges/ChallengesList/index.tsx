'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'

export const ChallengesList = () => {
  const { challengingService } = useRest({ isAuthenticated: false })
  const { challenges, isLoading, isRecheadedEnd, handleShowMore } =
    useChallengesList(challengingService)

  return (
    <ChallengesListView
      challenges={challenges}
      isLoading={isLoading}
      isRecheadedEnd={isRecheadedEnd}
      onShowMore={handleShowMore}
    />
  )
}
