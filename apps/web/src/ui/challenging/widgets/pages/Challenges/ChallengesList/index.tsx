'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'

export const ChallengesList = () => {
  const { user } = useAuthContext()
  const { challengingService } = useRest()
  const { challenges, isLoading, isRecheadedEnd, handleShowMore } =
    useChallengesList(challengingService)

  if (user)
    return (
      <ChallengesListView
        challenges={challenges}
        isLoading={isLoading}
        isRecheadedEnd={isRecheadedEnd}
        completedChallengesIds={user.completedChallengesIds}
        onShowMore={handleShowMore}
      />
    )
}
