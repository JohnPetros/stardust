'use client'

import { Id } from '@stardust/core/global/structures'

import { useRest } from '@/ui/global/hooks/useRest'
import { useSolutionsCommentsList } from './useSolutionCommentsList'
import { SolutionCommentsListView } from './SolutionCommentsListView'

type SolutionCommentsListProps = {
  solutionId: string
}

export const SolutionCommentsList = ({ solutionId }: SolutionCommentsListProps) => {
  const { forumService } = useRest()
  const { handlePostComment, handleFetchComments } = useSolutionsCommentsList(
    Id.create(solutionId),
    forumService,
  )

  return (
    <SolutionCommentsListView
      onFetchComments={handleFetchComments}
      onPostComment={handlePostComment}
    />
  )
}
