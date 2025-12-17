'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export const ChallengesList = () => {
  const { account, user } = useAuthContext()
  const { challengingService } = useRest({
    isAuthenticated: account?.isAuthenticated.isTrue ?? false,
  })
  const { challenges, isLoading, isReachedEnd, handleShowMore } = useChallengesList({
    challengingService,
    userId: user ? user.id : null,
  })

  return (
    <ChallengesListView
      challenges={challenges}
      isLoading={isLoading}
      isReachedEnd={isReachedEnd}
      onShowMore={handleShowMore}
    />
  )
}
