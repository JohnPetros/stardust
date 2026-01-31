'use client'

import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'
import { ChallengeCommentsSlotView } from './ChallengeCommentsSlotView'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { Id } from '@stardust/core/global/structures'

type Props = {
  challengeId: string
}

export const ChallengeCommentsSlot = ({ challengeId }: Props) => {
  const { forumService } = useRestContext()
  const { handleCommentListFetch, handleCommentPost } = useChallengeCommentsSlot(
    forumService,
    Id.create(challengeId),
  )

  return (
    <ChallengeCommentsSlotView
      onFetchComments={handleCommentListFetch}
      onPostComment={handleCommentPost}
    />
  )
}
