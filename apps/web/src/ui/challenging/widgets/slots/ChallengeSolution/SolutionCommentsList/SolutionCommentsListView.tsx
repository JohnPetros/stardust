'use client'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { Comment } from '@stardust/core/forum/entities'
import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { PaginationResponse, RestResponse } from '@stardust/core/global/responses'

type SolutionCommentsListProps = {
  onFetchComments: (
    params: CommentsListParams,
  ) => Promise<RestResponse<PaginationResponse<CommentDto>>>
  onPostComment: (comment: Comment) => Promise<RestResponse<CommentDto>>
}

export const SolutionCommentsListView = ({
  onFetchComments,
  onPostComment,
}: SolutionCommentsListProps) => {
  return (
    <CommentsList
      inputPlaceholder='Deixe um comentário sobre essa solução desse desafio'
      emptyListMessage='Essa solução ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
      onFetchComments={onFetchComments}
      onPostComment={onPostComment}
    />
  )
}
