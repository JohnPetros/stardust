'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'

export const ChallengesList = () => {
  const { user } = useAuthContext()
  const { challengingService } = useRest({ isAuthenticated: false })
  const { challenges, isLoading, isRecheadedEnd, handleShowMore } =
    useChallengesList(challengingService)

  return (
    <ChallengesListView
      challenges={challenges}
      isLoading={isLoading}
      isRecheadedEnd={isRecheadedEnd}
      completedChallengesIds={user?.completedChallengesIds.dto ?? []}
      onShowMore={handleShowMore}
    />
  )
}
