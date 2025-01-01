import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListingParams } from '@stardust/core/forum/types'
import type { CommentDto } from '@stardust/core/forum/dtos'
import type { ApiResponse, PaginationResponse } from '@stardust/core/responses'

export type CommentsListProps = {
  onFetchComments: (
    params: CommentsListingParams,
  ) => Promise<ApiResponse<PaginationResponse<CommentDto>>>
  onSaveComment: (comment: Comment) => Promise<void>
}
