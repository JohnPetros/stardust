'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useChallengesList } from './useChallengesList'
import { ChallengesListView } from './ChallengesListView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { Logical } from '@stardust/core/global/structures'

export const ChallengesList = () => {
  const { user } = useAuthContext()
  const { challengingService } = useRestContext()
  const { challenges, isLoading, isReachedEnd, handleShowMore } = useChallengesList({
    challengingService,
    userId: user ? user.id : null,
    isUserGod: user?.isGod ?? Logical.createAsFalse(),
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
