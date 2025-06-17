'use client'

import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'
import { ChallengeCommentsSlotView } from './ChallengeCommentsSlotView'
import { useRest } from '@/ui/global/hooks/useRest'
import { Id } from '@stardust/core/global/structures'

type Props = {
  challengeId: string
}

export const ChallengeCommentsSlot = ({ challengeId }: Props) => {
  const { forumService } = useRest()
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
