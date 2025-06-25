'use client'

import { Id } from '@stardust/core/global/structures'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { useRest } from '@/ui/global/hooks/useRest'
import { useSolutionsCommentsList } from './useSolutionCommentsList'

type SolutionCommentsListProps = {
  solutionId: string
}

export function SolutionCommentsList({ solutionId }: SolutionCommentsListProps) {
  const { forumService } = useRest()
  const { handlePostComment, handleFetchComments } = useSolutionsCommentsList(
    Id.create(solutionId),
    forumService,
  )

  return (
    <CommentsList
      inputPlaceholder='Deixe um comentário sobre essa solução desse desafio'
      emptyListMessage='Essa solução ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
      onFetchComments={handleFetchComments}
      onPostComment={handlePostComment}
    />
  )
}
