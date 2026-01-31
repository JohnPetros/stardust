'use client'

import { Id } from '@stardust/core/global/structures'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useSolutionsCommentsList } from './useSolutionCommentsList'
import { SolutionCommentsListView } from './SolutionCommentsListView'

type SolutionCommentsListProps = {
  solutionId: string
}

export const SolutionCommentsList = ({ solutionId }: SolutionCommentsListProps) => {
  const { forumService } = useRestContext()
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
