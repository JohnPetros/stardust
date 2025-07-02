'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useUserSolutionButtons } from './useUserSolutionButtons'
import { useRest } from '@/ui/global/hooks/useRest'
import { Id, Slug } from '@stardust/core/global/structures'
import { UserSolutionButtonsView } from './UserSolutionButtonsView'

type Props = {
  solutionId: string
  solutionSlug: string
  authorId: string
  challengeSlug: string
}

export const UserSolutionButtons = ({
  solutionId,
  authorId,
  solutionSlug,
  challengeSlug,
}: Props) => {
  const { user } = useAuthContext()
  const { challengingService } = useRest()
  const { handleDeleteSolutionButtonClick } = useUserSolutionButtons({
    solutionId: Id.create(solutionId),
    challengeSlug: Slug.create(challengeSlug),
    challengingService,
  })
  const isUserAuthor = user?.id.value === authorId

  if (user)
    return (
      <UserSolutionButtonsView
        solutionSlug={solutionSlug}
        challengeSlug={challengeSlug}
        isUserAuthor={isUserAuthor}
        onDeleteSolutionButtonClick={handleDeleteSolutionButtonClick}
      />
    )
}
