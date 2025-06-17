'use client'

import { useChallengeDescriptionSlot } from './useChallengeDescriptionSlot'
import { ChallengeDescriptionSlotView } from './ChallengeDescriptionSlotView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export const ChallengeDescriptionSlot = () => {
  const { user } = useAuthContext()
  const { mdx, isUserChallengeAuthor, isCompleted, challenge, isLoading } =
    useChallengeDescriptionSlot(user)

  return (
    <ChallengeDescriptionSlotView
      isLoading={isLoading}
      challenge={challenge}
      isUserChallengeAuthor={isUserChallengeAuthor}
      isCompleted={isCompleted}
      mdx={mdx}
    />
  )
}
