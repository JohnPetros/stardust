'use client'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { useSolutionsCommentsList } from './useSolutionCommentsList'

type SolutionCommentsListProps = {
  solutionId: string
}

export function SolutionCommentsList({ solutionId }: SolutionCommentsListProps) {
  const { handleCommentSave, handleCommentListFetch } =
    useSolutionsCommentsList(solutionId)

  return (
    <CommentsList
      inputPlaceholder='Deixe um comentário sobre essa solução desse desafio'
      emptyListMessage='Essa solução ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
      onFetchComments={handleCommentListFetch}
      onSaveComment={handleCommentSave}
    />
  )
}
