'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export const ChallengesList = () => {
  const { account, user } = useAuthContext()
  const { challengingService } = useRestContext()
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
